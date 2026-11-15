# Decision: first publish by Koss from his terminal, then trusted publishing (2026-11-15)

**Decided by:** Koss, 2026-11-15, Phase 1 before step 3. Replaces runbook steps 3-4 (token + NPM_TOKEN secret) and the workflow route for 0.1.0.
**Finding:** npm changelog 2026-07-31 (github.blog/changelog/2026-07-31-restricting-npm-bypass-2fa-granular-access-tokens): bypass-2FA granular tokens lose direct publish, targeting January 2027; npm recommends trusted publishing (OIDC). docs.npmjs.com/trusted-publishers: configured per package under Settings → Trusted publishing (needs npm CLI ≥ 11.5.1, Node ≥ 22.14.0, `id-token: write`); the package must exist first. Repo Loomlyne/ui-system is public, so provenance applies.
**Options:** Koss publishes once locally with 2FA, then trusted publishing · token as planned.
**Chosen:** Koss publishes 0.1.0 once from `main` in his terminal (`pnpm publish`, so `workspace:*` becomes `0.1.0`), approving 2FA in the browser. Then publish.yml moves to trusted publishing and Koss ticks the trusted publisher on both packages. No token stored.
**Order:** PR with rename merges first (his Ship), so published code = `main`.
