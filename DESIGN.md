# Design guide

Pick a style for the buyer and the work the screen has to support. Reuse an existing design system if the brand or UI already has one.

| Style | When to pick it | Theme |
| --- | --- | --- |
| Tool-led | Default for B2B SaaS: the visitor needs to see what the product does | `tool` |
| Editorial | Founder-led services or a high-consideration offer with real examples and longer reading | `editorial` |
| Technical | Data products, developer tools, and especially buyers who need to inspect the system | `technical` |

Set `site.theme` in `content/site.ts`. The starter applies it to the HTML root; the token overrides live in `app/globals.css`. These presets change colour and type. Change the section order when the buyer needs a different argument. Recapture the preview if you change anything visible in the workspace.

## Landing

Use a capped canvas and one spacing rhythm. Give adjacent sections room to breathe. The hero should show who the product helps, the job it does, and one usable action on the first desktop screen. Reuse the same primary action at the close. A quiet anchor link can serve a reader who needs more detail. Use a real product screenshot with alt text or an interaction that demonstrates the job. Start with hero, product proof, workflow, objections, and close. Add pricing or a customer story only when it helps the reader decide.

## Workspace

Use a narrow rail, strong page title, useful action, filters or views, and a table. Keep stages legible as text and colour; use a sheet for record edits and a separate page for a multi-step task. Handle empty, loading, error, and saved states when they apply. On small screens keep a usable scroll region for tabular data and make the primary task operable by touch and keyboard.

Use the shared button variants. Keep touch targets generous and focus visible. Reserve Motion for changes that help users follow state. Use CSS for simple feedback, with reduced-motion support. Avoid simultaneous motion around data entry.

## Demo material

The landing hero uses desktop (1512 × 1100) and mobile (390 × 844) captures of `/crm/overview` on fictional data. The feature tiles use 860 × 540 crops from the pipeline, inbox and owner views. Update the screenshots and alt text together when changing the demo. The landing section layouts are adapted from the Tailark OSS registry. See the [UI audit](docs/UI-AUDIT.md#landing-block-pass) for exact block names.

## Folio CRM

The expanded CRM lives under `/crm/overview` with people, companies, pipeline, campaigns, inbox, tasks, templates, analytics, and settings. Its cool white canvas, pale gray sidebar, navy text, blue accents, and small pastel identity marks take cues from Attio and Warmbly. The Folio mark is an original vector. Motion is reserved for navigation feedback, charts, and deal movement. Campaigns simulate sending. Local browser storage keeps drafts, tasks, preferences, and pipeline changes.
