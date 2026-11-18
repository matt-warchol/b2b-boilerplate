# Working on the B2B Product Starter

Default audience is B2B. Confirm if the request points elsewhere. Use English by default. Read [DESIGN.md](DESIGN.md) before changing layouts or components. Read [the starter skill](.agents/skills/b2b-starter/SKILL.md) for a new project or an audit.

- **Small changes need only a route and desired edit.** Treat `AGENTS.md` as automatic project context; silently inspect local source/components, avoid a full audit unless requested, then provide a brief result and tests. PRs run [UI reuse guard](docs/UI-REUSE-GUARD.md), which blocks exact component-name collisions and flags suspected duplicate UI for review.
- Keep the public site, workspace shell, and business workflows separate. Reuse the button variants, spacing tokens, table patterns, and form states.
- **Before any UI code, use the actual inventory.** Read [docs/design-system-docs.md](docs/design-system-docs.md), inspect the linked TypeScript exports and find actual usage. The inventory distinguishes installed components from upstream recommendations. Name the source files and existing imports in your reuse map. See [docs/USING-WITH-AI.md](docs/USING-WITH-AI.md) for verified Start and Audit prompts. Do not fabricate props, APIs, routes, dependencies or production capabilities.
- **Registry-only UI.** Build every screen from ready-made components: shadcn/ui first (`components/ui`, official blocks), then a licence-checked open-source shadcn registry (Tailark, Dice UI, Kibo UI). Never hand-roll a primitive the registry has (button, input, select, textarea, table, tabs, dialog/sheet, alert, empty state, separator, sidebar, badge, toast). ESLint blocks raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<table>`, `<hr>` and similar outside `components/ui`; an exception needs an `eslint-disable` comment with the reason and a line in [docs/UI-AUDIT.md](docs/UI-AUDIT.md#allowed-exceptions). Add a missing registry component with `npx shadcn@latest add <name>` instead of writing CSS for it.
- For new UI and audits, follow the [shadcn-first workflow](DESIGN.md#shadcn-first-workflow) and use the [starter's open-source library defaults](DESIGN.md#open-source-library-defaults). Before writing UI, record the block or components you will reuse and why any exception is needed. Before handoff, compare that plan with actual imports and rendered behavior. Apply the same checks to proposals and findings in a read-only audit.
- **Product email and email audits.** Start with [the Folidock email module and audit checklist](docs/EMAIL.md). Map existing mail to the seven templates and reuse the shared layout, copy patterns, and server delivery adapter. Keep the target project’s working auth, billing, provider, and event flows. When fixes are requested, apply them in the target repo and test with previews or a simulator. Keep real delivery gated by the owner’s activation.
- Lead public pages with one buyer, one promised result, and one primary action. Cite or remove unsupported claims.
- If the user's Unslop AI skill is available, run it on the assembled draft. See [the copy review](docs/COPY_REVIEW.md) for the fallback.
- Keep demo data fictional and local. A new provider, data integration, or external action needs an explicit task scope. Never expose API keys in client code.
- Before handoff run `npm run check`, then exercise the relevant flow at desktop and mobile widths.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
