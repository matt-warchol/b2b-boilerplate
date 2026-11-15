# Working on the B2B Product Starter

Default audience is B2B. Confirm if the request points elsewhere. Use English by default. Read [DESIGN.md](DESIGN.md) before changing layouts or components. Read [the starter skill](.agents/skills/b2b-starter/SKILL.md) for a new project or an audit.

- Keep the public site, workspace shell, and business workflows separate. Reuse the button variants, spacing tokens, table patterns, and form states.
- Lead public pages with one buyer, one promised result, and one primary action. Cite or remove unsupported claims.
- If the user's Unslop AI skill is available, run it on the assembled draft. See [the copy review](docs/COPY_REVIEW.md) for the fallback.
- Keep demo data fictional and local. A new provider, data integration, or external action needs an explicit task scope. Never expose API keys in client code.
- Before handoff run `npm run check`, then exercise the relevant flow at desktop and mobile widths.
