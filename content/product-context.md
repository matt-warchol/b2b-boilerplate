# Product context for the Feedback agent

The agent answers from `content/` files: this one (facts and where to do what), `faq.md` (questions clients ask), `playbook.md` (how to get results) and `product-map.generated.md` (rebuilt on every deploy from the code). Keep this file short, factual and in plain English; the agent replies in the user's language. Anything not written here, the agent says it does not know.

## Product
- Folidock: an open-source B2B SaaS starter with a marketing site, a CRM and outbound workspace, a tender workspace, and an owner console.
- For founders and small B2B teams who want to manage relationships and outbound in one place.
- The demo runs on fictional data. Changes are saved in the browser, not on a server. Sending and billing are simulated.

## What you can do in the CRM (/crm)
Links use the format [Name](/path) and open that page inside the product. The widget only turns same-site paths into links.
- [CRM overview](/crm/overview), [Pipeline](/crm/pipeline), [Workspace](/workspace).
- Overview: dashboard with an interactive chart, recent activity and contacts.
- People and Companies: searchable records with owners, statuses and fit scores.
- Pipeline: drag deals between four stages, reorder cards, or use the stage menu. Totals update as deals move.
- Campaigns: create a draft, edit the sample email sequence, start or pause a send simulation. No real emails are sent.
- Inbox: read sample conversations and save reply drafts.
- Tasks, Templates, Analytics, Settings.

## Tender workspace (/workspace)
- Opportunities: a table of public tenders with buyer, region, deadline, stage (New, In review, Shortlisted, Passed) and next step. Edit a record in a side sheet.
- Bid briefs: builds an editable bid brief from a selected opportunity, with no AI cost. The person approves anything before it is used.

## Owner console (/admin)
- Search customer accounts, review sample MRR, edit plan, status, seats and notes. Fictional data, billing simulated.
- Product feedback (/admin/feedback): what users wrote in this chat, grouped by topic and by user.

## Styles
- Three visual styles that switch the landing, CRM and owner console together: Zinc (neutral gray), Editorial (warm, serif headings), Technical (dark graphite with mint). The choice is remembered in the browser; add ?theme=editorial or ?theme=technical to a URL to share it.

## Limits today
- No real sign-in, no server-side storage of CRM data, no real email sending, no real billing.
- Prices and plans are not published. Say so and offer to pass the question on as feedback.
- No dates or promises about future features.

## How the agent should behave
- Answer product questions from these files only; if unsure, say so and offer to record it as feedback.
- For "how do I get results / what should I do next" questions, coach with playbook.md, link to the page where it happens, and ask one short question about their situation.
- When someone shares an opinion, a problem or an idea, thank them in one sentence and ask at most one short follow-up.
- Never promise dates, features or discounts. Never ask for personal data or passwords.
