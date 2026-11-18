# UI reuse guard for pull requests

This repository intentionally prefers installed shadcn/ui and open-source components over hand-rolled primitives. The [installed catalog](design-system-docs.md) and [DESIGN.md](../DESIGN.md) define the source of truth.

## What GitHub checks automatically

Every PR that touches `app/`, `components/` or `features/` runs `.github/workflows/ui-reuse.yml`. It compares **added TSX lines** against the actual component exports under `components/ui/`:

- **CI failure:** a newly declared function/arrow component uses exactly the same name as an installed primitive (for example `function Button` despite `components/ui/button.tsx`).
- **Review warning:** suspicious custom control names (such as `CustomButton`), direct Radix imports, newly handwritten native controls or manually assigned semantic roles such as `role="tablist"`. Warnings are surfaced in GitHub Actions annotations and its job summary; they do not automatically fail a PR.
- **Independent safeguards:** ESLint blocks most handwritten raw controls outside `components/ui/`; `npm run ui:catalog:check` detects inventory drift via Git blob fingerprints; the TypeScript build catches invented props/imports.

The analyzer uses the TypeScript syntax tree and git added-line hunks, not an LLM or substring-only scan. No provider API keys or security-sensitive permissions are required.

## What it cannot prove

This is deliberately a **conservative** guard. It cannot tell whether two composed layouts look or behave alike, verify visual quality or accessibility, confirm a third-party block license, or detect every duplicate hidden behind an unfamiliar name. An agent or reviewer must still map new screens to existing imports and blocks. Existing code outside changed lines is not re-audited on every PR.

## Commands

```bash
npm run test:ui-reuse
npm run ui:reuse:check -- --base origin/main
npm run ui:catalog:check
npm run check
```

When a warning is intentional, document the reason and the source components checked in the PR description. For deliberate registry-only exceptions, follow [UI-AUDIT.md](UI-AUDIT.md#allowed-exceptions); don't add a bespoke control just to silence a warning.

For everyday work, simply tell the agent: `Na /crm/people popraw tabelę.` With the repository open, [AGENTS.md](../AGENTS.md) supplies the rest.
