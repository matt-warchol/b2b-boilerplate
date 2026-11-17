# Feedback agent

Floating chat (bottom right, every page). It answers from `content/product-context.md` and collects feedback.

## Flow
1. Widget posts the conversation to `POST /api/feedback/chat` with the session id and `location.href`.
2. Server resolves user and workspace (`lib/feedback/identity.ts`, anonymous until you add auth), calls the model, and writes the user and assistant rows to the `feedback` table.
3. PostHog server-side events: `feedback_message` on every message, `feedback_summary` when the model returns a summary. Both carry `$current_url`.
4. `/admin/feedback` lists messages grouped by topic (token from `FEEDBACK_ADMIN_TOKEN`).
5. `GET /api/feedback/digest` runs daily at 07:00 UTC (`vercel.json`), needs `CRON_SECRET`, sends the last 24 h via Resend.

## Setup
1. Run `supabase/feedback.sql`.
2. Set the variables from `.env.example` in Vercel (Preview first).
3. Edit `content/product-context.md` for the product.

## Model
`FEEDBACK_LLM_PROVIDER` (`openai`, `anthropic`, `openai-compatible`), `FEEDBACK_LLM_API_KEY`, optional `FEEDBACK_LLM_MODEL` (defaults: gpt-4o-mini, claude-haiku-5-5). Calls are plain `fetch`, no SDK. Without a key the widget still stores messages and replies with a fixed thanks.

## Limits and known gaps
- Input 1,000 chars, last 10 turns, 400 output tokens, 20 s timeout. No per-IP rate limit or spend cap yet: add one before a public launch (see docs/PRODUCTION.md).
- Messages are stored in plain text; do not ask for personal data.
- Port to RFPZen: copy `lib/feedback`, `app/api/feedback`, `app/admin/feedback`, `components/feedback`, `content/product-context.md`, `supabase/feedback.sql`, `vercel.json` cron; replace `resolveIdentity` with the real session and put the admin page behind owner auth.
