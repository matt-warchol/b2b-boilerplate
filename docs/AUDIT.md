# Audit an existing B2B product

Use this with any stack. Read the repo’s instructions and run the target route if possible. A static review and a live review cover different ground; say which you could do.

1. **Context:** Record the user, buyer, business goal, CTA, route, and role. Inspect existing branding, components, analytics if supplied, and what the product actually does. Use safe sample data for screenshots.
2. **Landing:** Review first-screen clarity, conversion path and destination, value proof, section order, copy, CTA variants, spacing, mobile layout, and keyboard focus. Open links and exercise forms with safe inputs and explicit authorization if they contact anyone.
3. **Workspace:** Walk one core task at desktop and phone widths. Check navigation, filter/sort/search, table scrolling, data-entry, validation, empty/loading/error states, feedback and next action. Try keyboard-only and reduced motion. Check whether record persistence and permissions match the copy.
4. **Check UI reuse:** Trace imports and rendered behavior. For major sections and interactions, record the current source, a matching official shadcn block or component where available, and whether replacing the current UI would improve the result. Review icons, charts and motion against the [open-source defaults](../DESIGN.md#open-source-library-defaults). Follow both checks in the [shadcn-first workflow](../DESIGN.md#shadcn-first-workflow). Label anything you could not verify and keep working components that already meet the need.
5. **Prioritize:** Use the format below. Separate confirmed defects from hypotheses; suggest a measurement for a conversion claim. Propose small changes inside the existing design system. An audit request is read-only unless fixes are also requested.

| Priority | Route / step | Evidence | Impact | Smallest useful fix | How to verify |
| --- | --- | --- | --- | --- | --- |
| P0 blocker / P1 high / P2 improvement | URL or file and viewport | Screenshot, reproduction, or file and line | Task blocked or sales friction | Specific change | Observable outcome |

Example: P1 / mobile landing, 390 px / “Try” and “Schedule” look equally primary and go to different flows / buyer has to choose before seeing the product / keep the demo CTA primary and move scheduling after the proof section / link and keyboard checks, then compare demo starts from the landing.
