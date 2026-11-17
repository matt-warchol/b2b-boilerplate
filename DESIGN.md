# Design guide

Pick a style for the buyer and the work the screen has to support. Reuse an existing design system if the brand or UI already has one.

| Style | When to pick it | Theme |
| --- | --- | --- |
| Zinc | Default for B2B SaaS and CRM. shadcn/ui Zinc, Geist, split intro, and a wide preview. | `zinc` |
| Editorial | Founder-led or high-consideration products. Warm palette, centered hero, and serif headings. | `editorial` |
| Technical | Data and developer products. Dark palette, mint accent, side-by-side hero, and denser dashboard. | `technical` |

Set `site.theme` in `content/site.ts` as the default. The Style picker on the landing, CRM, and owner console remembers the selected preset locally. Add `?theme=editorial` or `?theme=technical` to a demo URL to share that style. Edit `app/themes.css` to adapt shadcn tokens, chart colors, type, and layout. The presets share the same Tailark and shadcn components. Change the section order when the buyer needs a different argument.

## Registry-only UI

The starter is meant to be assembled by agents from ready-made parts. Custom UI is the last resort.

1. **Look up the registry before writing markup.** For each element on the screen, find the shadcn/ui component or block (`npx shadcn@latest add <name>`). Common mappings: action → Button; field → Input/Textarea/Select with Label; list of records → Table (+ TanStack Table for sorting and paging); view switch → Tabs or Toggle Group; record edit → Sheet; confirmation → Dialog/Alert Dialog; status line → Alert; nothing to show → Empty; divider → Separator; app shell → Sidebar (dashboard-01); metrics → Card (SectionCards); clickable row → Item; status → Badge; notification → Sonner.
2. **Then an open-source shadcn registry** with a checked licence: Tailark for marketing sections, Dice UI or Kibo UI for kanban, file upload, tags input and stepper.
3. **Only then compose.** If nothing fits, compose from registry primitives. Write custom CSS only for layout and brand tokens, never for a control the registry already styles.
4. **Enforced.** `npm run lint` fails on raw form, table and dialog elements outside `components/ui`. Each allowed exception carries an `eslint-disable-next-line no-restricted-syntax -- reason` comment and appears in [docs/UI-AUDIT.md](docs/UI-AUDIT.md#allowed-exceptions).

## shadcn-first workflow

Treat Folidock as a working example of composition and theming. Use shadcn/ui as the first source for reusable UI.

1. **Inspect the project.** Check its framework, `components.json`, installed UI components, design tokens, and icon library. Reuse components already installed from shadcn/ui. For an existing product, preserve its working design system and recommend migration only where it addresses a specific problem.
2. **Look for a complete block first.** Search the official [shadcn Blocks](https://ui.shadcn.com/blocks) for the screen or section. For gaps, check the official [component catalog](https://ui.shadcn.com/docs/components) and compose the screen from the relevant primitives. This applies to navigation, forms, tables, charts, overlays, feedback, and loading and empty states. Follow the official [installation guide](https://ui.shadcn.com/docs/installation) for the target stack and add the missing pieces through the [CLI](https://ui.shadcn.com/docs/cli). Keep the project's existing Radix or Base UI setup.
3. **Adapt the smallest surface.** Plug in real product data and copy, then use shared tokens for type, spacing, and color. If the official registry has no good fit, check a compatible open-source shadcn registry such as [Tailark OSS](https://tailark.com/docs) and verify the license before copying code into a template. Compose custom markup for product-specific needs that the available blocks and primitives do not cover. Keep reusable pieces shared when another view needs them.
4. **Reuse icons and interactions.** Use the project's icon library, with [Lucide](https://lucide.dev/icons/) as the default for greenfield work. Reserve original artwork for the brand or a domain-specific visual. Keep the component's built-in interaction and animation where suitable. Use [Motion for React (Framer Motion)](https://motion.dev/docs/react) for additional transitions, layout changes, and reveals. Respect [reduced motion](https://motion.dev/docs/react-accessibility), and check keyboard and touch behavior. Keep chart interactions in the shadcn Chart/Recharts implementation.
5. **Verify and report provenance.** Distinguish an installed block, a composition of registry components, and a visual reference. Name what drives motion (registry, Recharts, Motion, or CSS). See [Folidock's UI audit](docs/UI-AUDIT.md) for an example.

Use two checks on every new screen, redesign, or UI audit:

- **Before implementation or recommendation:** make a short reuse map for the main sections and interactions. List the existing component or exact registry block, its source, and the reason for each proposed custom piece. Check the registry and existing code before concluding that no suitable option exists.
- **Before handoff:** compare the map with the files and running UI. Confirm the imports and test the relevant layout, controls, chart interaction, and motion. Report where you reused a complete block, composed primitives, or made an exception. Correct undocumented duplication where implementation is in scope. In a read-only audit, report it as a finding. Mark anything you could not verify.

## Open-source library defaults

These are the preferred tools for the jobs they already cover in Folidock. Use a suitable library already in the target repo before introducing a duplicate. Install only what the screen needs.

| Job | Preferred source |
| --- | --- |
| App shells, sidebars, navigation, forms, dialogs, tables, empty and loading states | [shadcn/ui](https://ui.shadcn.com/docs/installation) and [official blocks](https://ui.shadcn.com/blocks). Folidock uses the Radix registry, including dashboard-01. |
| Ready-made marketing sections | Official shadcn blocks first. Use [Tailark OSS](https://tailark.com/docs) where the official registry has no suitable section. Folidock uses its hero, feature grid, FAQ, CTA, and footer layouts. |
| Theme, layout, spacing and responsive states | [Tailwind CSS](https://tailwindcss.com/docs) and the project's existing shadcn theme tokens. |
| Transitions, layout animation and reveals | [Motion for React](https://motion.dev/docs/react), alongside existing component transitions and reduced-motion support. |
| Standard interface icons | [Lucide](https://lucide.dev/icons/), or the target repo's established icon library. Folidock uses [DiceBear Notionists](https://www.dicebear.com/styles/notionists/) for optional demo avatar assets. |
| Drag-and-drop boards | [Dice UI Kanban (Radix)](https://diceui.com/docs/components/radix/kanban) with [dnd-kit](https://dndkit.com/). Compose it with shadcn Card and Select for moving deals. |
| Interactive charts | [shadcn Chart](https://ui.shadcn.com/docs/components/chart) with [Recharts](https://recharts.github.io/). Keep chart tooltips, legends and accessibility features where relevant. |
| Table sorting, filters and selection that outgrow a basic table | shadcn Table with [TanStack Table](https://tanstack.com/table/latest/docs/introduction) for behavior. Folidock uses this combination in the tender workspace. |

## Settings and data-sharing patterns

Proven in RFPZen (rfpzen.com, Nov 2026). Reuse these instead of designing settings screens from scratch.

| Need | Use | Notes |
| --- | --- | --- |
| Upload documents | [Dice UI File Upload](https://www.diceui.com/docs/components/file-upload) (`npx shadcn@latest add "https://diceui.com/r/file-upload"`) | Centered dropzone: round icon, one line title, one line of limits, a "Browse files" button; border darkens on drag-over; keyboard: Enter/Space opens the picker. Below it a shadcn Table of files with a Select per row for the category. |
| Show what is still missing | shadcn Card grid (3 columns, 1 on mobile) | One card per document type; filled state uses the success tint. A Badge in the header says "2 of 6 ready". |
| Connect Notion / Google Drive / SharePoint | shadcn Card per source: title, one line hint, then form | Card is `flex flex-col`; the hint has a fixed min-height and the form sits at `mt-auto`, so the buttons line up across cards. Always add a "Safe by design" list: read-only, one folder, EU storage, not used for training, one-click delete. |
| Email notification frequency | shadcn Table + Select (Off / Daily / Weekly) per row | Save on change and show "Saved" next to the heading. Store per member, send from a daily cron. |
| Webhook to a CRM | Input + Button "Save" + Button "Send a test" | Explain in one sentence what is sent and when; recommend Zapier, Make or n8n for HubSpot/Pipedrive/Attio. Server forwards the request (https only, no raw IPs). |
| Deadlines to a calendar | Link to an `.ics` route | Works with Google, Outlook and Apple Calendar without OAuth. |
| Help text that would clutter the page | `details`/Accordion "Why they ask and how to answer" | Plain language; pair every question with a "Suggest an answer" Button that prefills an editable Textarea. |
| Feedback from any page | Floating Button bottom-right opening a Card with a Textarea | Send the message with the page URL; also capture a PostHog event. |

Remove legal-sounding grey footnotes from product screens; put commitments in one "Safe by design" block where they matter.

## Landing

Use a capped canvas and one spacing rhythm. Give adjacent sections room to breathe. The hero should show who the product helps, the job it does, and one usable action on the first desktop screen. Reuse the same primary action at the close. A quiet anchor link can serve a reader who needs more detail. Use a real product screenshot with alt text or an interaction that demonstrates the job. Start with hero, product proof, workflow, objections, and close. Add pricing or a customer story only when it helps the reader decide.

## Workspace

Use a narrow rail, strong page title, useful action, filters or views, and a table. Keep stages legible as text and colour; use a sheet for record edits and a separate page for a multi-step task. Handle empty, loading, error, and saved states when they apply. On small screens keep a usable scroll region for tabular data and make the primary task operable by touch and keyboard.

Use the shared button variants. Keep touch targets generous and focus visible. Reserve Motion for changes that help users follow state. Use CSS for simple feedback, with reduced-motion support. Avoid simultaneous motion around data entry.

## Demo material

The landing hero uses desktop (1512 × 1100) and mobile (390 × 844) captures of `/crm/overview` on fictional data for each theme. The feature tiles use 860 × 540 crops from the pipeline, inbox and owner views. The `Capture previews` GitHub Action runs `scripts/capture-previews.mjs` to recapture the hero in all three styles and refresh the feature tiles. It runs when a theme file changes or on demand from the Actions tab. Update the alt text when the content changes. The landing section layouts are adapted from the Tailark OSS registry. See the [UI audit](docs/UI-AUDIT.md#landing-block-pass) for exact block names.

## Folidock CRM

The expanded CRM lives under `/crm/overview` with people, companies, pipeline, campaigns, inbox, tasks, templates, analytics, and settings. Its default Zinc workspace uses a white canvas, pale gray sidebar, charcoal text, and small status accents. The Folidock mark is an original vector. Motion animates screen entrances and landing reveals. Recharts and dnd-kit animate the chart and deal movement. Campaigns simulate sending. Local browser storage keeps drafts, tasks, preferences, and pipeline changes.

## Legal pages

- `/privacy` and `/terms` render `content/legal.ts` through `components/marketing/legal-page.tsx` (marketing header and footer, one readable column, `max-w-3xl`). Footer bottom bar links both.
- The text is a plain-language template: set operator, contact, providers, retention and law before launch, delete sections you don't use, and get a lawyer's review.
- Google and Notion require public privacy and terms URLs before you publish an OAuth app. Keep the "Google user data" (Limited Use) section if you use Google APIs.
- Put a one-line privacy note with a link under any form that collects emails.
