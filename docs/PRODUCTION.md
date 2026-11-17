# From local demo to a B2B app

Ship production plumbing in the order the first workflow needs it.

| Add when | Build |
| --- | --- |
| People from different companies sign in | Authentication, organizations, invitations, membership roles, and server-side authorization on every read and write |
| Records need to be shared | A database and tenant-scoped records, migrations, backups, a data import/export path, and audit events for important changes |
| The workflow needs email | Reuse the [React Email and Resend module](EMAIL.md). Connect trusted product events, make retries idempotent, and record delivery status |
| Teams use it repeatedly | Onboarding, configurable views, telemetry for activation, error monitoring, reminders and background jobs where justified |
| Customers pay | Tenant-level plan limits, usage reporting, recovery paths for failed payments, and a direct upgrade path |

Do not use the browser demo store for customer data or authorization. It intentionally has no login or backend.

## Owner access and billing

The `/admin` route is a public owner demo. Its sample directory and changes live in the browser. Before connecting actual accounts, enforce platform-owner authorization for the page and every server read and write. Store memberships, seats and notes in your database, with an audit trail for plan and status changes. Treat a billing provider as the source of truth for payment status and recurring revenue. Calculate those totals from active subscriptions rather than from the demo's plan-price constants.

## AI: give the user one useful result first

Start with the deterministic [brief engine](../features/briefs/engine.ts). It gives the user a source-grounded draft at zero model cost. The paid upgrade should improve one action the user can inspect: draft a bid brief from selected evidence, identify missing facts, or suggest the next action. Keep the draft editable and let a person approve any submission.

| Mode | How it works | Start with |
| --- | --- | --- |
| Local template | Map record fields into a predictable output | Enabled in the demo |
| Hosted AI | App pays for a provider call through an authenticated server endpoint | Optional, explicit click, limited included generations per workspace |
| Bring your own key | Customer supplies provider credentials if the provider supports that model | Offer only if customers ask; encrypt credentials on the server, never put them in browser storage |

When you add a provider, keep it behind a server-only adapter; keep the local template as the fallback. Send only the selected record and evidence the user authorizes. Enforce tenant access, cap input and output, use a cheaper model for the default action, and set a timeout. Reserve spend against a per-workspace and product-wide limit before starting a request; reconcile against actual provider usage. Set an explicit currency cap, define what happens when it is reached, and test concurrent requests. Rate limits alone do not cap spend. Cache identical input and prompt versions only inside the same workspace where policy allows it. Log cost and outcome without logging keys or confidential source text. Run no provider calls on page load.

Price the feature from measured cost per useful result. Use the template fallback while you learn whether customers will pay for the model-assisted step.
