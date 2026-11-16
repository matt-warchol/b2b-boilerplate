# Working on the B2B Product Starter

Default audience is B2B. Confirm if the request points elsewhere. Use English by default. Read [DESIGN.md](DESIGN.md) before changing layouts or components. Read [the starter skill](.agents/skills/b2b-starter/SKILL.md) for a new project or an audit.

- Keep the public site, workspace shell, and business workflows separate. Reuse the button variants, spacing tokens, table patterns, and form states.
- For new UI and audits, follow the [shadcn-first workflow](DESIGN.md#shadcn-first-workflow) and use the [starter's open-source library defaults](DESIGN.md#open-source-library-defaults). Before writing UI, record the block or components you will reuse and why any exception is needed. Before handoff, compare that plan with actual imports and rendered behavior. Apply the same checks to proposals and findings in a read-only audit.
- Lead public pages with one buyer, one promised result, and one primary action. Cite or remove unsupported claims.
- If the user's Unslop AI skill is available, run it on the assembled draft. See [the copy review](docs/COPY_REVIEW.md) for the fallback.
- Keep demo data fictional and local. A new provider, data integration, or external action needs an explicit task scope. Never expose API keys in client code.
- Before handoff run `npm run check`, then exercise the relevant flow at desktop and mobile widths.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
