# Logo Generator — paid wizard specification

Status: **documented / planned**. The reusable [agent skill](../.agents/skills/b2b-logo-generator/SKILL.md) is available to use manually in an AI agent. There is no wizard screen, image API integration, asset exporter, or automatic project branding implementation in this change.

## Expected behavior

The founder supplies the exact brand name, description, buyer, and optional colors. Distinguish icon, wordmark, and full logo. Default discovery crosses **six minimalist icon concepts with six distinct wordmark/layout treatments = 36 full-logo options**. Show six draft sheets with six labeled combinations each. If the user already selected icons, preserve them and explore only that subset: three icons × six treatments = 18 options.

The icon has no text; the wordmark must contain the exact brand name. Define six treatments once and apply them consistently across icons, varying typography, spacing, weight and layout. Keep each icon stable across its sheet. Marks retain the five reference archetypes plus an original direction, flat shapes, one or two colors, and favicon-oriented simplicity. Reference brands express principles, not shapes to duplicate.

Use low quality/resolution for discovery where supported. If the tool exposes no quality control, say so and do not claim lower cost. Contact sheets are draft comparison artifacts; individual high-resolution outputs come only after the user selects cell IDs. The user can request more combinations or continue in their own agent with the brief, references, prompts, and feedback. Costs and quotas depend on that agent/provider.

## Model guidance

Documentation checked **2026-11-17**. These are practical starting recommendations, not comparative logo benchmarks. Recheck provider documentation, account availability, prices, supported edits and output formats before implementing or spending on a batch.

- **Default:** a current OpenAI GPT Image model available in the user's agent. The [image tool guide](https://developers.openai.com/api/docs/guides/tools-image-generation) currently recommends `gpt-image-2.5-flare` for fast generation and `gpt-image-2.5-sunburst` for precise editing. Prefer the editing option when refining a selected mark. Agent UI model names and API model IDs can differ; do not promise those IDs are selectable in every agent.
- **Alternative:** [FLUX.2](https://help.bfl.ai/articles/4292391522-what-is-flux-2), using its pro variant for a quality/speed balance or max for quality exploration. Verify the chosen variant's commercial license; dev is described as free for non-commercial development, not blanket commercial use.
- The original prompt mentions Midjourney and DALL·E 3. Keep prompts portable, but do not default a new integration to DALL·E 3: the [OpenAI API reference](https://developers.openai.com/api/reference/resources/images/methods/generate) lists its retirement on May 12, 2026. Midjourney remains a user-selected workflow rather than a promised integration here.

“Vector style” describes appearance. Generated raster artwork does not become SVG by renaming it. A production asset step must reconstruct or vectorize the chosen mark, clean paths, and inspect the result. Model output does not guarantee originality, trademark clearance, exact geometry, or legibility at 16px. Inspect the actual mark before calling it favicon-ready.

## Planned wizard flow

1. **Project setup:** name, description, domain, and buyer.
2. **Module selection:** explain available starter modules; allow opting into Logo Generator, uploading an existing logo, or skipping branding.
3. **Brand brief and model:** colors and visual constraints, model availability, expected provider charge before generation. Keep credentials out of chat, prompts, client bundles, and logs; use the planned secure server-side integration setup when needed.
4. **Draft matrix:** six icons × six wordmark/layout treatments, 36 labeled full-logo options on six sheets. Respect existing selections (three icons = 18). Show rationale, palette, prompts, and actual quality-control availability; distinguish failed, pending, and completed cells.
5. **Select and refine:** user selects cell IDs; only then generate individual higher-quality logos, correct typography/spacing, or copy context to their own agent. Do not upscale the whole matrix.
6. **Prepare assets:** planned PNG, cleaned SVG, favicon, and light/dark variants. Verify 16px/32px and monochrome readability; show pending work until checked.
7. **Apply and review:** planned preview of the selected assets in the landing and workspace, then explicit selection before applying project branding. Continue integration setup and deployment separately.

## Implementation acceptance criteria

- Six distinct icon concepts crossed with six distinct type/layout treatments: 36 labeled full-logo cells, or exactly the selected subset (three icons = 18).
- Exact name spelling, stable icons across treatments, complete manifest, honest quality/cost reporting, and transparent partial failures.
- High-quality individual refinement starts only after selection; final fonts must be licensed and typeset accurately.
- Copyable prompts and portable iteration context work without wizard access or embedded secrets.
- Existing logo upload and skip remain usable; generation is optional.
- Asset export and project application are only advertised once implemented and verified.
- Before UI implementation, read DESIGN.md and record registry component reuse. Then run the repository checks and exercise generation, failure, skip, iteration, and apply at desktop and mobile widths. No UI was changed for this specification.
