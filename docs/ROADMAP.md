# Product roadmap

This is a backlog, not a list of shipped paid capabilities. The current demo and starter remain described in [README](../README.md).

## Paid configuration wizard — planned

Guide a founder through project name/domain, module selection, secure integration setup, project generation, and deployment. Explain what each module provides before selection. Provider credentials belong in protected server-side configuration, never client code, logs, or copied agent prompts. No paid wizard or automatic provisioning is implemented yet.

- [ ] Define module boundaries, configuration persistence, secret handling, and deployment ownership.
- [ ] Build the setup and selection screens using the starter's registry-first workflow.
- [ ] Add the optional [Logo Generator flow](LOGO-GENERATOR.md): brief → six concepts/previews → select or iterate in the user's agent → validated assets → apply to project.
- [x] Document a reusable [logo-generation skill](../.agents/skills/b2b-logo-generator/SKILL.md), rationale/prompts, portable iteration, and model caveats.
- [ ] Implement image generation with visible costs, quotas, and partial-failure handling.
- [ ] Implement SVG cleanup, PNG/favicon exports, light/dark variants, and project branding preview/application.
- [ ] Verify the complete configuration and deployment journey before advertising it as available.

## Product research — planned

Review [ShipFast](https://shipfa.st/) for onboarding and packaging ideas, then evaluate commercializing this starter. This is a research task; no third-party code or assets are included by this documentation change.
