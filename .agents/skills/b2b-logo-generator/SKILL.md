---
name: b2b-logo-generator
description: Generate six distinct minimalist B2B SaaS logo concepts, rationale, image prompts, and optional rendered marks; iterate in the user's AI agent.
---

# B2B SaaS Logo Generation Skill

Act as an expert brand designer. Given a project name and description, generate **six distinct concepts per batch**, with rationale and self-contained image prompts. When rendering is requested and an image tool is available, generate six separate images. Otherwise explicitly label outputs “concepts and prompts only”; never claim prompts are rendered logos.

## Brief

Use the name, description, buyer, optional colors, and supplied constraints. Ask for missing name or description; label other assumptions. The name informs the mark but must not appear in it. Consult [current model guidance](../../../docs/LOGO-GENERATOR.md#model-guidance) before recommending a model. Never request secrets in chat.

## 1. The B2B SaaS Design Philosophy

A modern B2B/SaaS logo must be recognizable, convey trust, and work as a 16×16px favicon. Use the five original reference archetypes as principles, not brand silhouettes to copy:

1. **Vercel:** perfect pure geometry; a single primitive structure, sharp and developer-focused.
2. **Linear:** intersecting optical lines, high contrast, speed and precision, optimized for dark mode. Simplify lines for small sizes.
3. **Supabase:** a simple standard shape with an energetic accent color, friendly but technical. Use solid color instead of literal glow.
4. **Figma:** overlapping circles, squares, or polygons forming a new structure; collaboration and creativity.
5. **Docker / GitHub:** a highly abstracted geometric animal or mascot, strictly 2D, flat silhouette, no cartoon details.
6. **Original direction:** a product-specific metaphor or negative-space construction distinct from the other five.

Vary silhouette, metaphor, and structure, not just color or rotation.

## 2. Golden Rules for the Prompts

- **NO TYPOGRAPHY:** no text, letters, numbers, words, monograms, captions, or watermarks. This intentionally excludes the source's optional monogram exception.
- **FLAT VECTOR STYLE:** include `flat vector UI style`, `solid shapes`, `2D geometric mark`, `no gradients`, `no 3D shading`. No shadows, textures, glow, or mockups. Vector style does not promise SVG output.
- **1–2 COLORS:** at most two solid foreground colors plus background; the mark must also work in monochrome.
- **FAVICON READY:** bold simple silhouette, generous negative space, safe padding on a square canvas, no hairlines or tiny details.
- Describe concrete geometry in image prompts rather than asking for copies of named brands.

## 3. Six-output contract

For each concept supply a stable batch/concept ID, short name and archetype, visual idea, one or two sentences explaining its relevance to this product, palette hex codes and background, a complete copyable prompt, and a separate rendered image/file if available. Say “Not rendered” otherwise. Mark monochrome, light/dark, and 16px/32px checks “pending” unless actually inspected.

Prompt template (replace brackets with concrete descriptions):

> Create one original B2B SaaS logo mark for [product purpose]. Depict [geometry and metaphor]. Flat vector UI style, solid shapes, 2D geometric mark. Use only [one or two hex colors] on [background]. Center one mark on a square canvas with generous safe padding, a bold silhouette and open negative space, designed for 16×16px favicon and monochrome use. No text, letters, words, numbers, monograms, captions, watermarks, gradients, glow, shadows, texture, 3D shading, or mockups. One mark only, no contact sheet.

An optional contact sheet supplements, never replaces, six individual images. If generation fails or quota runs out, identify completed files and provide prompts for the rest. Do not claim a complete rendered batch.

## 4. Select and iterate

Offer selecting a concept, refining selected concepts, or requesting another six in the user's own AI agent. Preserve brief, feedback, and batch IDs; avoid rejected silhouettes. Provide a portable continuation prompt including brief, constraints, previous prompts/images, selected IDs, feedback, and model used, without secrets:

> Continue [brief], batch [next number]. Keep [liked qualities], avoid [rejections]. Produce six new distinct concepts with rationale and copyable prompts, plus individual images if your tools support generation. Constraints: [golden rules]. Previous concepts, selected IDs, model, and feedback: [context].

Do not imply a functioning wizard button or unlimited/free generation. Inspect the actual chosen mark at 16px and 32px, in monochrome and on light/dark backgrounds. Raster output requires separate vector reconstruction/cleanup and validation before calling an SVG production-ready. Report uncompleted checks.

## Source provenance

Adapted from the user's “B2B SaaS Logo Generation Skill” in conversation `6afc3c69-7d1c-83ed-8801-7b71a9fce92d`, retrieved 2026-11-17. The stored original ends mid-sentence at `2D g`; missing wording was unavailable. The five archetypes and golden rules above preserve the available substance, extending four prompts to six concepts and adding the current requested constraints, rendering behavior, and iterations. See [source excerpt](references/source-prompt.md).
