# Feedback agent

A reusable module: a chat inside the product that answers questions from a knowledge base and collects feedback, in any language. It is for signed-in users only and is never mounted on the public site.

## What users see
One short intro: this is the feedback agent, it answers from the knowledge base, and feedback is used to improve the product for them. Replies use the user's language.

## What you get
- Every message saved in Supabase (`feedback` table) with user, workspace, page, topic, sentiment and a one-line summary.
- PostHog events `feedback_message` and `feedback_summary`, both with `$current_url`.
- `/admin/feedback`: by topic and by user and page, 1/7/30/90 days. "Copy prompt + data for Claude" puts a ready prompt (`content/feedback-prompt.ts`) and the export on the clipboard. "Download .md" gives the same data as a file.
- Daily email digest through Resend (`/api/feedback/digest`, 07:00 UTC via `vercel.json`).

## Flow
1. Widget (`components/feedback`) is mounted in the product layouts (`app/(app)/workspace/layout.tsx`, `app/crm/layout.tsx`).
2. `POST /api/feedback/chat` resolves the user (`lib/feedback/identity.ts`), checks limits and budget, calls the model, saves both messages, sends events.
3. Unknown user: 401. No Supabase configured: 503 (fail closed, because the spend cap needs it).

## Limits (per API call, in `lib/feedback/config.ts`)
- 1,000 characters in, 10 turns of history, 400 tokens out, 20 s timeout, 20 KB body.
- Per user: 20 messages/hour, 60/day. Per chat: 30. Per workspace: 300/day.
- Daily budget across all users: `FEEDBACK_DAILY_BUDGET_USD` (default 2). Spend is counted from the provider's token usage and the prices you set. When reached, the agent pauses until the next UTC day and says so. The check runs before each call, so concurrent requests can overshoot by a few cents.
- Default model: Claude Haiku. Change with `FEEDBACK_LLM_PROVIDER` and `FEEDBACK_LLM_MODEL`.

## Knowledge base
- `content/product-context.md`, `content/faq.md`, `content/playbook.md`: curated, edit by hand. The product context links to pages with `[Name](/path)`; the widget renders only same-site paths as links. Replies can run up to about 90 words (800 output tokens); if the model gets cut off the reply is salvaged from the partial JSON.
- `content/product-map.generated.md`: screens, pages, FAQ and styles read from the code by `scripts/product-map.mjs` before every build. Do not edit.
- A weekly scheduled task compares the curated file with the code and opens a pull request when the product changed.

## Setup
1. Run `supabase/feedback.sql`.
2. Set the variables from `.env.example` in Vercel. On Preview set `FEEDBACK_ALLOW_DEMO_USER=1`, because the starter has no sign-in.
3. Edit `content/product-context.md` for your product.

## Port to another product (e.g. RFPZen)
Copy `lib/feedback`, `app/api/feedback`, `app/admin/feedback`, `components/feedback`, `content/product-context.md`, `content/faq.md`, `content/playbook.md`, `content/feedback-prompt.ts`, `scripts/product-map.mjs`, `supabase/feedback.sql`, the `vercel.json` cron, the `prebuild` script and the `outputFileTracingIncludes` entry. Then replace `resolveIdentity` with the real session, mount the widget in the signed-in layout, and put `/admin/feedback` behind owner auth instead of the token.

## Security
- Keys live only in server environment variables (Vercel, marked Sensitive). Nothing is prefixed `NEXT_PUBLIC_`. The Supabase service role key is used only on the server, and the table has row-level security with no policies.
- Chat API: same-origin JSON calls only, signed-in users only, size cap, limits per user, chat, workspace and IP (the IP is stored as a salted hash), daily budget stop at 90%.
- Admin and export: token of 24+ characters, stored in the cookie only as a hash (httpOnly, secure, strict, 8 h), 1.5 s delay on a wrong token. Cron route: Bearer secret, timing-safe check.
- Agent has no tools and cannot act. Users' text is escaped in the admin page and the email, and marked as untrusted in the Claude export.
- The hard stop for money is the spending limit in your model provider's console. The in-app budget is a second layer, not atomic.
- Widget is off until `FEEDBACK_ENABLED=1`.

## Known gaps
- Messages are stored as plain text. The agent never asks for personal data, but users can type anything.
- Limits count rows in Supabase, so they are not atomic. For hard guarantees, add a Postgres function or a rate limiter.
