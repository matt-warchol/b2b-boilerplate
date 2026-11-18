# Using Folidock with an AI coding agent: Start or Audit

Folidock is a working B2B **demo starter**, not an automatically production-ready SaaS. Real auth, persistence, billing, provider keys and email delivery require setup, tests and security review. Treat the checked-out code as the source of truth and all demo-only behavior as demo-only.

## First: give the agent the repository, not just a website URL

Clone or open the repo in Codex, Claude Code, Cursor or a comparable coding agent. For an audit of your existing app, give the agent access to **both** the target repo and this starter, or paste the relevant files. Then run:

```bash
npm ci
npm run ui:catalog:check
npm run check
```

Ask the agent to read in order: [AGENTS.md](../AGENTS.md), [DESIGN.md](../DESIGN.md), [installed components and props](design-system-docs.md), [the B2B starter skill](../.agents/skills/b2b-starter/SKILL.md) and the feature source files. For audits, also read [AUDIT.md](AUDIT.md). The current dependency/registry manifests are `package.json` and `components.json`.

## Copy this into your agent: Create a product

> I want to build **[product]** for **[B2B buyer/user]** to help them **[specific job]**. Use this Folidock repo as the starting point. First inspect AGENTS.md, DESIGN.md, docs/design-system-docs.md, the starter skill, package.json and actual feature code. Before making changes, show me a concise inventory of what is already implemented, what is simulated, what is missing, and which exact components/props/routes exist. Create a reuse map (screen section → exact local component or official registry block → adaptation). Do not invent imports, APIs or dependencies and do not rewrite existing UI primitives. Build one valuable end-to-end workflow first, adapt the shared branding/tokens, and list any secrets or backend configuration as explicit manual setup. After implementation refresh the UI catalog, run npm run check and test desktop/mobile and keyboard flows. Report files changed, tests actually run, unresolved items, and which features remain demo-only.

## Copy this into your agent: Audit an existing product

> Audit **[target repo/path]** using Folidock as a **reference**, not as a wholesale replacement. Read AGENTS.md, DESIGN.md, docs/design-system-docs.md, docs/AUDIT.md and the target product's own architecture and UI first. Produce evidence-backed findings with real file:line references, severity, impact and proposed fixes. For each UI issue, identify an already installed component or exact upstream block, explicitly saying which. Do not claim a feature, API, prop, library or integration exists unless you have verified its source. Preserve working auth, providers, permissions, design system and business flows. Build a reuse map and recommend small changes first. Only implement approved fixes; then run the target's checks, exercise affected desktop/mobile flows and state what could not be verified.

## Quick changes: no long prompts necessary

In a coding agent with this repository open, say just:

> On `/crm/people`, make the table more compact.

Or, in Polish: `Na /crm/people popraw odstępy w tabeli.`

**No slash command or lengthy instruction is required.** `AGENTS.md` applies to the repository. The agent should silently consult the component catalog and local source, use installed components, then report what changed and what it tested. For small tasks, do not start a full audit or request a long brief; a 1–2 sentence summary is enough.

A GitHub pull request also runs [the UI reuse guard](UI-REUSE-GUARD.md), which blocks exact installed-component name collisions and flags suspicious reimplementations for human review. It cannot recognize every visually equivalent component.

## The anti-hallucination protocol

1. **Code over guesses.** An existing TypeScript export and its actual usage beats model memory or upstream example code. Verify package versions, props, routes, schema, backend wiring and whether a component is *installed* or merely *recommended*.
2. **Show the reuse map before touching UI.** Identify the exact import or block and file path for shell, forms, tables, charts, interaction and marketing sections. Search `components/ui`, `components/marketing`, `features` and `docs/design-system-docs.md` first.
3. **Distinguish 3 states:** implemented and working; present but demo/simulated; planned or absent. Never describe the latter as shipped. A missing source or test means **unverified**, not a fabricated answer.
4. **No secret guessing.** Do not invent credentials, vendor configuration, production auth, payment flows or real outbound. Keep external actions disabled pending configuration and explicit approval.
5. **Verify the result.** Compare the reuse map to actual imports; run `npm run ui:catalog` after adding UI components, run `npm run check`, check responsive and keyboard behavior, and flag skipped tests and remaining exceptions.
6. **Use the registry deliberately.** Installed shadcn components come first, official shadcn blocks next, Tailark and Dice UI only when needed and license-checked. Use Motion, Lucide, Recharts and TanStack Table per [DESIGN.md](../DESIGN.md).

## Relevant built-in modules

The feedback agent is documented in [FEEDBACK.md](FEEDBACK.md). Its widget and admin UI are implemented, but provider keys, Supabase configuration and activation are required. The Logo Generator in [LOGO-GENERATOR.md](LOGO-GENERATOR.md) is an agent skill and paid-wizard roadmap item, **not** an integrated live image-generation service. See [PRODUCTION.md](PRODUCTION.md) before launch.
