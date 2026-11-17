# Product email

Folidock ships seven English product emails in React Email with a server-side Resend adapter. Demo campaigns stay simulated. The email module starts in `dry-run` and needs no provider credentials for development or previews.

## Templates and triggers

| Template | Trigger in the product | Link destination |
| --- | --- | --- |
| `welcome` | Once after signup verification | The first useful action in the workspace |
| `first-result` | The first successful result for the intended user or workspace | The actual saved result |
| `setup-reminder` | Once, on day 3–5, if the user still needs the initial action and can receive lifecycle mail | The setup step |
| `trial-ending` | Before the end date from billing, if the trial is still active and the user can receive lifecycle mail | Billing or plan settings |
| `team-invite` | After an authorized workspace invitation | The invitation from the membership system |
| `password-reset` | After the existing auth system issues a reset link | The expiring, single-use reset link |
| `magic-link` | After the existing auth system issues a sign-in link | The expiring, single-use sign-in link |

Edit the [brand settings](../content/email.ts), [message copy](../features/email/messages.ts), and [shared React Email layout](../features/email/email-template.tsx). The text is original. The layout uses the free React Email library and follows the single-column patterns in its template catalog. Postmark’s open-source templates are references for message structure and action wording. Record the source and keep its license notice if you copy a template. [React Email templates](https://react.email/templates) · [Postmark templates](https://github.com/ActiveCampaign/postmark-templates)

## Preview and test

1. Run `npm ci`, then `npm run email:preview`. Open the seven previews at [localhost:3001](http://localhost:3001). They use fictional recipients, records, and links. [React Email CLI](https://react.email/docs/cli)
2. Run `npm run test:email` for HTML and plain-text rendering, offline dry run, configuration checks, lifecycle skips, and mocked provider responses.
3. For a provider smoke test, the owner can add a restricted Resend key and the matching verified sender in `.env.local`, then explicitly run `npm run email:smoke`. This submits fictional data to `delivered@resend.dev` and prints the accepted message ID. The command uses the Resend simulator independently of `EMAIL_MODE`. [Resend test addresses](https://resend.com/changelog/sending-test-emails)

## Connect product events

Import `sendProductEmail` from `@/features/email/server` in an authorized server handler or background job. Pass an event ID, one recipient from a trusted record, and a template payload. The public demo has no live auth, billing, outbox, or send endpoint. Attach the call below to your existing product flow and recheck access when the job runs.

```ts
await sendProductEmail({
  eventId: `verified-signup/${signup.id}`,
  to: signup.email,
  message: {
    kind: "welcome",
    firstName: signup.firstName,
    firstAction: "add your first contact",
    actionPath: "/crm/people",
  },
});
```

- Use a stable event ID for one intended email. Keep the original payload stable across retries. Persist the intent and its status in the product’s existing outbox or job store and enforce uniqueness for the template, event, and recipient. The adapter supplies a stable Resend idempotency key with its 24-hour window. Reconcile ambiguous sends before retrying beyond that window. [Resend idempotency keys](https://resend.com/docs/dashboard/emails/idempotency-keys)
- Use the mailer’s result to record `accepted`, skipped, or failed. Accepted means the provider queued the message. Retry transient failures through the product job system with a bounded attempt count and backoff. Respect `retryAfterSeconds` when supplied. For delivery, bounces, and complaints, use verified provider webhooks, deduplicate events, and update suppression records. [Resend webhook verification](https://resend.com/docs/webhooks/verify-webhooks-requests)
- Issue and check invitation and auth tokens through the product’s existing auth or membership flow. Pass a server-built path on `EMAIL_APP_ORIGIN` and use the actual token lifetime. Ensure link scanning and preview requests cannot consume a one-time token before the recipient acts. Disable click tracking on auth emails. Keep recipient addresses, tokens, URLs, and message bodies out of logs.
- Check lifecycle preferences and the qualifying account state when the job runs. Pass `canReceiveLifecycleEmail` and a working `unsubscribePath` for reminders. The mailer skips recipients whose preference is disabled. Use the product’s scheduler for reminders and existing auth or billing provider events for account and trial state. Set limits appropriate to the free plan and reserve capacity for account mail.

## Activate live delivery

1. Copy `.env.example` to `.env.local`. For a deployment, add the variables to its server-side environment. Set `EMAIL_APP_ORIGIN` to the production HTTPS origin.
2. Verify a sending domain in Resend. Add the provider’s SPF and DKIM records and configure DMARC for the sender domain. Set `EMAIL_FROM` to a verified sender and set `EMAIL_REPLY_TO` when replies should go to a separate monitored inbox. Use a domain-scoped sending key as `RESEND_API_KEY`. [Resend domain setup](https://resend.com/docs/dashboard/domains/introduction)
3. Review previews and run the simulator. Confirm the product’s event hooks, lifecycle preferences, retry and suppression behavior, and plan limits. Then set `EMAIL_MODE=live` on the approved deployment. Set it back to `dry-run` to pause new sends.

If a target product already uses Mailgun, retain its server transport and render the same React Email templates for it. Use its existing idempotency and delivery state controls. [Mailgun HTTP API](https://documentation.mailgun.com/docs/mailgun/user-manual/sending-messages/send-http)

## Audit a product with Folidock

1. Inventory the current subjects, bodies, event triggers, recipient rules, senders, links, and delivery/retry paths. Compare each with the closest template above. Flag missing events, duplicate sends, incorrect timing, broken or unsafe links, missing plain text, lifecycle preference gaps, and unhelpful copy.
2. Preserve the product’s working providers and event flows. Adapt these templates and the shared layout to the product language and real actions. Preserve required notices and working auth links. Use the product’s verified evidence and reuse the starter’s patterns before adding a template or transport.
3. If the request includes fixes, patch the product code, rerun previews and tests, and show the changed messages and triggers. Keep live sending subject to the owner’s approval. For a read-only review, return findings with the affected files and concrete edits.
