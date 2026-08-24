---
name: meet-admin
description: Implement or review Meet-Admin features and fixes while preserving its Vue 3, Element Plus, Pinia, UnoCSS, typed request, and dynamic-route conventions.
---

# Meet-Admin

Use this skill for code changes in the Meet-Admin repository. Follow the current `AGENTS.md` and nearby module patterns first. Apply the `frontend` principles for evidence-based discovery, contract safety, minimal changes, and validation.

## Start from existing project patterns

For a normal CRUD page, inspect only what the task needs, typically in this order: the target `views` module, a similar page in the same module, its API module, `AppTable` and `useTable`, `AppForm`, `AppPopup`, `useReset`, permissions, and related types or utilities.

Keep simple pages in `index.vue`; introduce module `components/` or `hooks/` only when there is a concrete local need. Put cross-business hooks in `src/hooks`, business-module sharing in that module, and small single-component logic in the component.

Prefer the project component stack: existing `App*` components, then Element Plus, then installed capabilities, before custom implementations. `App*` components are globally auto-imported when exported by `src/components/index.ts`; do not add redundant imports. Vue, Vue Router, Pinia, VueUse, and Vue I18n APIs are also auto-imported.

## APIs, types, permissions, and routes

Keep API modules aligned with the consuming view or template boundary. A shared backend URL does not by itself require a shared frontend function if callers have distinct contracts. Use typed function declarations and the existing `request` wrapper; use `AppAxios.ResponseData`, `AppAxios.ApiPromise`, `AppAxios.PageData`, `AppAxios.ListOrPage`, and `AppAxios.Options` instead of duplicate response/page types. Let the wrapper handle duplicate requests, loading, success/error messages, authentication, and empty values when its options fit.

Add local types near their feature and reserve `src/typings` for genuinely shared ambient types. Never make up API fields, statuses, permissions, or response transforms. In templates use `v-auth`; use `hasAuth` for logic, and only use permission codes found in reliable project or backend context.

Business pages are normally dynamic routes. Before adding a static route or altering component resolution, read the existing router mapping; do not create a second mapping or assume the backend component-path format. Static business modules are the exception when the request explicitly requires them.

## UI, state, and localization

Use UnoCSS for straightforward layout, spacing, flex, and grid. Use SCSS for complex component states and Element Plus overrides. Follow the project's 4px spacing scale through UnoCSS utilities or `var(--spacing-*)`; avoid arbitrary spacing values.

Use setup-style Pinia stores and import individual stores from their deep paths. Do not add page-local transient state to Pinia. Add user-facing text to the existing locale files rather than hardcoding it.

## Verify proportionately

This repository has no general test suite. For normal Vue or TypeScript edits, run the affected-file lint check where possible and `pnpm type-check`; use `pnpm lint` and a build when the scope warrants it. Do not start `pnpm dev` by default. Keep automated fixes limited to touched files and do not bypass Git hooks.
