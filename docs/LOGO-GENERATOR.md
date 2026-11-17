# Logo Generator — paid wizard specification

Status: **documented / planned**. The reusable [agent skill](../.agents/skills/b2b-logo-generator/SKILL.md) is available to use manually in an AI agent. There is no wizard screen, image API integration, asset exporter, or automatic project branding implementation in this change.

## Expected behavior

The founder supplies a project name, description, buyer, and optional colors. Each batch produces six distinct concepts: pure geometry, optical lines, energetic simple shape, overlapping primitives, abstract mascot, and an original product-specific direction. Each includes rationale, palette, and a copyable prompt. With an available image tool, the agent generates six individual logo previews; without one it clearly supplies prompts only.

Marks use simple flat geometry, one or two colors, no typography, and a silhouette designed for favicon use. Reference brands describe principles, not shapes to duplicate. The user can select, refine, request six more, or copy the brief, prompts, and feedback into their own agent. Iterations use that agent's tools, quotas, and provider charges; no unlimited-generation promise.

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
4. **Generate six:** show each preview, rationale, palette, and prompt. Distinguish pending, failed, and completed images. A prompt-only fallback must say so.
5. **Select and iterate:** refine a choice, request another batch, or copy a continuation package for the user's own agent. Preserve feedback and allow returning with a selected asset.
6. **Prepare assets:** planned PNG, cleaned SVG, favicon, and light/dark variants. Verify 16px/32px and monochrome readability; show pending work until checked.
7. **Apply and review:** planned preview of the selected assets in the landing and workspace, then explicit selection before applying project branding. Continue integration setup and deployment separately.

## Implementation acceptance criteria

- Six meaningfully different concepts and six independent image outputs when rendering succeeds; transparent partial failures and prompt-only fallback.
- Copyable prompts and portable iteration context work without wizard access or embedded secrets.
- Existing logo upload and skip remain usable; generation is optional.
- Asset export and project application are only advertised once implemented and verified.
- Before UI implementation, read DESIGN.md and record registry component reuse. Then run the repository checks and exercise generation, failure, skip, iteration, and apply at desktop and mobile widths. No UI was changed for this specification.
