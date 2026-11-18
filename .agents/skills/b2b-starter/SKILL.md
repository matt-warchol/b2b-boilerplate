---
name: b2b-starter
description: Start or audit a B2B landing page and CRM-style product workspace. Use for landing conversion, buyer-focused copy, visual direction, product email setup and audits, and the first records-to-result workflow.
---

Pick **Start** for a new product or page and **Audit** for an existing project. In both modes, first use [the agent workflow](../../../docs/USING-WITH-AI.md) and [the installed component inventory](../../../docs/design-system-docs.md). Read the actual source types and usages before claiming a component or prop exists. Use the repo documents linked below. If the skill was copied by itself, ask for the missing context or use the same process against the target repository.

For both modes, follow the [shadcn-first workflow](../../../DESIGN.md#shadcn-first-workflow) and [open-source library defaults](../../../DESIGN.md#open-source-library-defaults). Check official blocks and components before proposing custom UI. Folidock is a reference implementation. If the design guide is unavailable, use the official [shadcn installation guide](https://ui.shadcn.com/docs/installation), [blocks](https://ui.shadcn.com/blocks), and [component catalog](https://ui.shadcn.com/docs/components). Make a reuse map before implementation or recommendations, then check it against actual imports and behavior before handoff.

## Product email

Read [the Folidock email guide](../../../docs/EMAIL.md) before writing templates or changing delivery. Map the product’s existing messages and event triggers to the starter’s seven templates. Reuse the React Email layout and copy patterns. Reuse the server adapter where Resend fits and preserve a working target provider. For an audit with fixes, apply improvements in the target repo, check previews and the relevant event flow, and report which templates and triggers changed. Keep live delivery gated by the owner’s activation.

## Start

1. Inspect the product and any existing styles, UI, customer language, and proof. Fill in [the project brief](../../../docs/PROJECT_BRIEF.md). Assume B2B unless the project clearly serves consumers. For B2B, distinguish the buyer, daily user, and approver. For B2C, rewrite the brief around the consumer’s own task and drop procurement assumptions.
2. Recommend one direction from [the style guide](../../../DESIGN.md) and say why. If the user has not chosen a direction and it matters, offer two or three options in one concise question. Continue with work that does not depend on the choice.
3. Apply the three roles in [the copy review](../../../docs/COPY_REVIEW.md). Give the landing one primary conversion goal. Begin with the working product as proof; add a case study, pricing, or stronger claims only when supported. Run the available Unslop AI skill as the last editorial pass or use the documented fallback.
4. Build one representative loop: find a record, make a decision or edit, and produce something another person can use. Check the relevant desktop and mobile flows before shipping.

## Audit

Follow [the audit playbook](../../../docs/AUDIT.md) on the existing stack. Verify which components and animations are actually used, and recommend registry replacements for duplicated or weak UI when they fit. Return evidence, impact, and a proposed fix in priority order. If asked to implement, patch the confirmed findings using the product’s own design system. Use the same audience and copy review steps when rewriting existing material.
