---
name: b2b-logo-generator
description: Explore full B2B SaaS logos with six icon concepts crossed with six wordmark treatments, then refine only selected combinations.
---

# B2B SaaS Logo Generator

Distinguish the **icon/mark**, **wordmark** (the brand name), and **full logo/lockup** (icon plus name). By default explore full logos, not isolated icons. Use an icon-only mode only when requested.

## Brief and scope

Use the project name with exact spelling/case, description, buyer, optional palette, and supplied references. Ask for a missing name or description; label other assumptions. Never ask for secrets in chat. Consult [model guidance](../../../docs/LOGO-GENERATOR.md#model-guidance) before recommending models.

Default discovery is **6 icons × 6 wordmark/layout treatments = 36 low-fidelity full-logo options**. If the user selects existing icons, preserve those references and generate only their subset: e.g. icons 1, 2, 6 × six treatments = 18 options. Do not restart six unrelated icons. Do not interpret a selection as approval to upscale or apply branding.

## Icon design principles

Create six distinct silhouettes/metaphors, not recolors. Use the five source archetypes as principles without copying recognizable brand shapes:

1. Vercel: pure primitive geometry, sharp and developer-focused.
2. Linear: intersecting optical lines, precision and high contrast; simplify for small sizes.
3. Supabase: simple shape and energetic solid accent color, no literal glow.
4. Figma: overlapping primitives expressing collaboration.
5. Docker / GitHub: abstract geometric mascot, flat silhouette without cartoon detail.
6. Original product-specific direction such as meaningful negative space.

Icon constraints: **no typography inside the icon**; flat vector UI style, solid shapes, 2D geometry, no gradients, shading, shadows, texture, or mockups. Use one or two foreground colors plus background. Bold silhouette, broad negative space, no hairlines. Design the icon for favicon use; do not require the full wordmark to remain readable at 16px. Vector appearance does not mean an SVG file.

## Six wordmark treatments

Define six visually distinct type/layout treatments once, then cross every selected icon with all six. Keep the icon's geometry and palette consistent across its row. Vary type family, weight, tracking, name color split, icon/name ratio, and horizontal versus stacked composition deliberately. Do not count six mere color swaps as six treatments.

Example starting set (adapt to the brief):

- A: horizontal, neutral grotesk, semibold, compact spacing.
- B: horizontal, geometric sans, medium weight, open spacing.
- C: horizontal, humanist sans, regular weight, softer character.
- D: horizontal, sturdy slab serif, medium weight, editorial character.
- E: stacked icon above name, bold rounded sans, centered.
- F: horizontal, technical monospace, medium weight, generous separation.

Spell the brand name exactly. The no-text rule applies **only to the icon**; the wordmark explicitly requires text. Use only the brand name unless a tagline is supplied. Font descriptions are visual directions, not verified font identities or licenses. For final assets choose a real licensed font and set the name with actual typography; do not preserve malformed generated lettering.

## Cheap discovery before refinement

Use draft/low quality where the tool exposes it. If it does not, disclose that limitation; never claim lower API cost or a quality setting that was not used. Do not silently switch to a paid API/CLI workflow. For discovery, contact sheets are the intended deliverable: one icon per sheet, six clearly separated full-logo cells, stable IDs such as 1A–1F. This supersedes the old requirement for six individual icon images. The default batch has six sheets/36 cells; a selected three-icon subset has three sheets/18 cells.

Maintain a manifest with icon rationale, palette/background, six treatment descriptions, cell IDs, exact prompts, references, tool/model if known, and file paths. Check sheet coverage and exact brand spelling; flag missing, malformed, or duplicated cells rather than claiming completeness. If no rendering tool is available, label outputs concepts/prompts only. For failures report actual completed cells/sheets.

Prompt structure:

> Create a low-fidelity exploration sheet with six full logo options for “[exact name]”, a product for [purpose/buyer]. Attached image is the fixed icon reference: preserve its silhouette and colors across all six cells. Arrange six spacious cells in a 2-column × 3-row grid. Each contains this icon PLUS the exact name “[name]”. Treatments: [A–F descriptions]. Label cells [icon ID+A–F] outside each logo. Palette [hex], background [hex]. Flat solid colors; no gradients, shading, shadows, textures, mockups, extra slogans, or typography inside the icon. Keep name legible, precisely spelled, and uncropped. Do not upscale or polish individual options yet.

## Select, iterate, then finish

Ask for cell IDs and feedback. Offer new treatments or another discovery batch in the user's own agent, carrying forward brief, references, selected/rejected IDs, prompts, and constraints without credentials. Keep IDs stable and avoid rejected directions.

Only after selection, render/refine chosen combinations individually at higher quality/resolution. Preserve chosen icon and type/layout relationship; improve geometry, kerning, alignment, spacing, and color accuracy. Upscaling alone does not fix poor geometry or typography. Final full-logo, standalone icon, monochrome, dark/light variants, PNG/SVG/favicon preparation and project application are separate steps. Inspect actual icon at 16px/32px and full logo at realistic header sizes. Raster output needs vector reconstruction/cleanup; do not claim production-ready SVG or completed checks without validation.

## Provenance

Adapted from the user's source prompt (four mark prompts → six icon concepts); [available original excerpt](references/source-prompt.md) is truncated at `2D g`. The user's subsequent correction introduces full-logo exploration, a 6×6 draft matrix, selected-icon subsets, and refinement only after selection. Keep the original excerpt unchanged as historical context.
