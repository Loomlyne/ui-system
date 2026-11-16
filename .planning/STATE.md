# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-11-15)

**Core value:** A product repo picks a preset, a kind and a brand, installs UI System from npm, and gets a themed, contrast-safe UI that passes `ui-system check`.
**Current focus:** Phase 1 — npm publish (milestone v0.1 "Published and current")

## Current Position

Phase: 1 of 5 (npm publish)
Plan: 0 of TBD (live steps: ROADMAP Phase 1 Success Criteria, from decisions/2026-11-15-npm-*.md, until `/gsd-plan-phase 1` writes 01-01-PLAN.md)
Status: Phase 1 publish is done. `0.2.0` (themes rename, neutral default, tokens) published by OIDC in run `43917624097` (`e4a44a2`); `latest` is `0.2.0`, verified by a clean install. `0.1.0` and `0.1.1` stay. Never publish an existing version again
Last activity: 2026-11-16 21:33 +0400 — 0.2.0 published and installed from npm

Progress: [░░░░░░░░░░] 0%

## Performance Metrics

**Velocity:**
- Total plans completed: 0
- Average duration: -
- Total execution time: -

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| - | - | - | - |

*Updated after each plan completion*

## Accumulated Context

### Decisions

Full log: PROJECT.md `<decisions>` (D-01 … D-20) and .planning/decisions/.

- 2026-11-15 D-20: publish both packages 0.1.0 in milestone 1 via `publish.yml`; driver Caractère Phase 1
- 2026-11-10 D-09: grouped canvas Tweaks
- 2026-11-09 D-05: presets are ways of designing; mist, signal, studio one at a time, pictures first

### Pending Todos

None yet.

### Blockers/Concerns

- Phase 1: both 0.1.0 packages are public. Core tarball has no `LICENSE` file (`"license": "MIT"` only). React tarball includes `LICENSE`. Each name also has placeholder `0.0.0-stage`. A later version is the only way to add the core LICENSE file.
- Phase 1: CLI `npm stage approve` and `npm stage reject` return 404 for this login. The Staged Packages tab is the approve path. The page can keep showing the row after the green "published successfully" banner.
- Phases 3-5: a new preset reaches products only after a version bump and republish; decide at Phase 3 discuss whether each preset phase ends with a release.
- Outside repo: Caractère .planning names `@ui-system/*`; its own session updates it.

## Deferred Items

| Category | Item | Status | Deferred At |
|----------|------|--------|-------------|
| *(none)* | | | |

## Session Continuity

Last session: 2026-11-15
Stopped at: 0.1.1 is public from publish.yml run 43736677043. Do not re-run 92f00d1. Do not republish 0.1.0 or 0.1.1. Next phase is docs, only when Koss says so.
Resume file: None
