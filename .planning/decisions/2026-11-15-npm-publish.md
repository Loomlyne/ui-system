> Superseded in part: scope → decisions/2026-11-15-npm-scope-loomlyne.md; steps 3-4 and workflow route → decisions/2026-11-15-npm-first-publish-local.md. Live steps: ROADMAP Phase 1.

# Decision: publish @ui-system/core and @ui-system/react to npm (2026-11-15)

**Decided by:** Koss (owner), 2026-11-15, during GSD ingest conflict gate.
**Question:** README and docs tell people to install from npm, but neither package is published. Where does npm publishing go?
**Options:** phase in milestone 1 · later and mark docs · never npm.
**Chosen:** publish now, milestone 1. Driver: the Caractère site (/Users/koss/Developer/Caractere, Phase 1) installs both packages from npm. Nothing else in this repo needs to change.

## Owner's words (goal)
Publish @ui-system/core and @ui-system/react (v0.1.0) to npm with this repo's own "Publish packages" workflow (.github/workflows/publish.yml, workflow_dispatch, --access public, needs repo secret NPM_TOKEN).

## Known state (checked 2026-11-15)
npm view @ui-system/react → E404; secret NPM_TOKEN not set; workflow never run; Koss not logged in to npm on this Mac (npm whoami → ENEEDAUTH); he has an npm account.

## Rule
Every step needing a password, 2FA or token is Koss's: one numbered step at a time, wait for "done", then check it. Never paste a token into chat or a file.

## Runbook (owner's steps)
1. Koss: `npm login` (browser). Check: `npm whoami`.
2. Check scope: `npm view @ui-system/core`; `npm org ls ui-system`. If org missing, Koss: npmjs.com → avatar → Add Organization → `ui-system` → Free. If the name is taken, STOP and ask about renaming the scope (e.g. `@loomlyne/*`), done by PR.
3. Koss: npmjs.com → Access Tokens → Generate New Token → Granular. Name `ui-system-publish`, 90 days, Packages and scopes Read and write, only the ui-system org, Bypass 2FA if shown. Copy once.
4. Koss: `gh secret set NPM_TOKEN -R Loomlyne/ui-system` (hidden prompt). Check: `gh secret list`.
5. Claude: `pnpm install --frozen-lockfile && pnpm build && pnpm typecheck` pass on main.
6. Ask Koss: "Publish @ui-system/core and @ui-system/react 0.1.0 publicly to npm now?" On yes: `gh workflow run publish.yml -R Loomlyne/ui-system`, then `gh run watch`.
7. Verify: `npm view @ui-system/core version` and `@ui-system/react version` print 0.1.0; `npm pack @ui-system/react --dry-run` lists dist/index.js and dist/index.d.ts.
8. Record in .planning/ and report verified / not verified / failed. Last line: PUBLISHED @ui-system/core@<v> @ui-system/react@<v>, or what blocked.
