# Landing variants (catalogue)

Seven landing directions explored for RFPZen in November 2026. Each is a full-page design on the
"RFPZen landing" Claude Design canvas (https://claude.ai/artifact/FxUtBePVu6NMKEsVkNCtcW). Pick one,
then build it from the registry (shadcn/ui, Tailark, Motion, shadcn Chart) like `rfpzen` did for R5.

| Variant | Canvas artboard | Look | Built in code |
| --- | --- | --- | --- |
| Original (before R5) | rfpzen commit `3ea6754` (`components/marketing/blocks.tsx`) | Zinc, split hero, framed screenshot, three screenshot tiles | Yes, in rfpzen history |
| A · Clarity | `#artboard-Main` | Warm off-white, editorial headings, dark product frame | No |
| B · Bento | `#artboard-B-Bento` | White, colour per pillar, bento grid, ROI sliders | No |
| C · Signal | `#artboard-C-Signal` | Dark hero with radar, tinted sections, win-odds calculator | No |
| 1 · Polish | `#artboard-NL1-Polish` | Same layout as the original, every screen animated, radar band | No |
| 3 · Dark stage | `#artboard-NL3-Dark-stage` | Dark hero stage with a slow radar, light sections, bento platform | No |
| R5 · Zinc + Green (live) | `#artboard-R5-1-Green` | Light hero with a live product stage, Find/Plan/Win, platform cards on muted tints | Yes: rfpzen `components/marketing/live.tsx`, `charts.tsx`, `blocks.tsx` |

Themes that pair with them: `zinc` (default), `green` (R5), `folio` (indigo), plus `editorial` and `technical`.

To-do: turn the variants into switchable presets (one `landing` setting in `content/site.ts`, sections
per variant), starting with R5 and 3 · Dark stage.
