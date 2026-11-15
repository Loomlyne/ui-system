# Decision: npm scope @loomlyne, not @ui-system (2026-11-15)

**Decided by:** Koss, 2026-11-15, Phase 1 step 2.
**Finding:** `@ui-system` npm scope is owned by someone else. `npm org ls ui-system` exits 0 with no members visible to koussayz; a made-up org (`zz-no-such-org-xq9`) returns E404 "Scope not found". `npm view @ui-system/core` → E404 (no packages). `loomlyne` → "Scope not found" (free).
**Options:** @loomlyne (matches GitHub org Loomlyne) · @koussayz (his user scope) · ask the @ui-system owner.
**Chosen:** @loomlyne. Packages: `@loomlyne/core`, `@loomlyne/react`. CLI bin stays `ui-system` (`npx -p @loomlyne/core ui-system check`).
**Done:** all 63 refs in 35 files renamed on branch claude/gsd-setup; pnpm build, typecheck, design pass; `npm pack --dry-run` in packages/react → `@loomlyne/react` 0.1.0 with dist/index.js + dist/index.d.ts.
**Outside this repo:** Caractère's .planning names `@ui-system/*` (PROJECT.md:22,68, REQUIREMENTS PLAT-06, ROADMAP:40, STATE:46); a Caractère session updates them (one product per session).
