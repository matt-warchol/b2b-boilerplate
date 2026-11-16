# Design guide

Pick a style for the buyer and the work the screen has to support. Reuse an existing design system if the brand or UI already has one.

| Style | When to pick it | Theme |
| --- | --- | --- |
| Tool-led | Default for B2B SaaS: the visitor needs to see what the product does | `tool` |
| Editorial | Founder-led services or a high-consideration offer with real examples and longer reading | `editorial` |
| Technical | Data products, developer tools, and especially buyers who need to inspect the system | `technical` |

Set `site.theme` in `content/site.ts`. The starter applies it to the HTML root; the token overrides live in `app/globals.css`. These presets change colour and type. Change the section order when the buyer needs a different argument. Recapture the preview if you change anything visible in the workspace.

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
| Interactive charts | [shadcn Chart](https://ui.shadcn.com/docs/components/chart) with [Recharts](https://recharts.github.io/). Keep chart tooltips, legends and accessibility features where relevant. |
| Table sorting, filters and selection that outgrow a basic table | shadcn Table with [TanStack Table](https://tanstack.com/table/latest/docs/introduction) for behavior. Folidock uses this combination in the tender workspace. |

## Landing

Use a capped canvas and one spacing rhythm. Give adjacent sections room to breathe. The hero should show who the product helps, the job it does, and one usable action on the first desktop screen. Reuse the same primary action at the close. A quiet anchor link can serve a reader who needs more detail. Use a real product screenshot with alt text or an interaction that demonstrates the job. Start with hero, product proof, workflow, objections, and close. Add pricing or a customer story only when it helps the reader decide.

## Workspace

Use a narrow rail, strong page title, useful action, filters or views, and a table. Keep stages legible as text and colour; use a sheet for record edits and a separate page for a multi-step task. Handle empty, loading, error, and saved states when they apply. On small screens keep a usable scroll region for tabular data and make the primary task operable by touch and keyboard.

Use the shared button variants. Keep touch targets generous and focus visible. Reserve Motion for changes that help users follow state. Use CSS for simple feedback, with reduced-motion support. Avoid simultaneous motion around data entry.

## Demo material

The landing hero uses desktop (1512 × 1100) and mobile (390 × 844) captures of `/crm/overview` on fictional data. The feature tiles use 860 × 540 crops from the pipeline, inbox and owner views. Update the screenshots and alt text together when changing the demo. The landing section layouts are adapted from the Tailark OSS registry. See the [UI audit](docs/UI-AUDIT.md#landing-block-pass) for exact block names.

## Folidock CRM

The expanded CRM lives under `/crm/overview` with people, companies, pipeline, campaigns, inbox, tasks, templates, analytics, and settings. Its cool white canvas, pale gray sidebar, navy text, blue accents, and small pastel identity marks take cues from Attio and Warmbly. The Folidock mark is an original vector. Motion is reserved for navigation feedback, charts, and deal movement. Campaigns simulate sending. Local browser storage keeps drafts, tasks, preferences, and pipeline changes.
