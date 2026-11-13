---
description: Wire UI System into the current repo (install, config, theme) or re-apply its rules to a UI task
argument-hint: "[preset] [kind] [what to build]"
---

Apply the `ui-system` skill. Its rules are mandatory for this whole task.

Arguments: $ARGUMENTS

## 1. Detect

Read `package.json`, lockfile, `ui.config.json` and the framework files in the open repo. Name the stack: Next.js (App Router), Vite/React, Tailwind v4, plain HTML, Framer, Shopify, or Expo. Name the package manager from the lockfile and use that one.

## 2. Already set up?

If `ui.config.json` and an `@ui-system/*` dependency exist, skip to step 6. Do not rewrite the config.

If the repo already has UI of its own and no UI System, this is an existing repo: follow skill section 7 (list conflicts, take each through the two-picture question) after step 5, before changing any look.

## 3. Ask (only what the arguments did not answer)

Ask preset (`ledger` or `atelier`), then kind (`shop`, `app`, `website`, `booking`, `portfolio`), then brand (wordmark, primary color). One question at a time, each with a picture of the options first and the recommended one first.

## 4. Install

Check the package is published: `npm view @ui-system/react version`.

- Published: add `@ui-system/core` and `@ui-system/react` with the repo's package manager.
- Not published (E404): stop and give Koss one numbered step: run the "Publish packages" workflow in github.com/Loomlyne/ui-system (needs the `NPM_TOKEN` secret). For a plain HTML or Framer repo you may continue meanwhile with the CDN link from `${CLAUDE_PLUGIN_ROOT}/docs/frameworks.md`.

## 5. Wire it

1. `npx -p @ui-system/core ui-system init --preset <preset> --kind <kind> --name "<brand>"` writes `ui.config.json` and prints the preset's rules, never-list and questions. Read that output.
2. Wire the theme for the detected stack by following `${CLAUDE_PLUGIN_ROOT}/docs/frameworks.md` (if that path is missing, read the same file at github.com/Loomlyne/ui-system/blob/main/docs/frameworks.md). For Expo, export tokens with the core CLI and use `tokens.json`.
3. Add a `ui:check` script to `package.json` (`ui-system check`) and include it in the repo's gate or pre-push check. Run it once and report the result.
4. Add this block to the repo's `CLAUDE.md` (create it if missing), so the rules hold in every later session, local or cloud:

```
## UI System
This repo uses UI System (preset: <preset>, kind: <kind>). `ui.config.json` is the single theme source.
Use the `ui-system` skill for any UI work. `ui:check` must pass. Any conflict with a rule: stop and ask the owner with two pictures (follows the rule / follows the request). No hard-coded colors, radii, fonts or shadows; Hugeicons only; Avatar for people; anime.js through Reveal/CountUp; 4.5:1 text contrast.
```

5. Add `ui-system@loomlyne` to the repo's `.claude/settings.json` so cloud sessions load the plugin:

```json
{
  "extraKnownMarketplaces": { "loomlyne": { "source": { "source": "github", "repo": "Loomlyne/ui-system" } } },
  "enabledPlugins": { "ui-system@loomlyne": true }
}
```

Merge into existing settings; never overwrite them.

## 6. Build the UI task

If the arguments describe something to build, build it now under the skill's track (components for dashboards, real references for sites and apps). Then run the skill's "Before saying done" checks and report verified, not verified, failed.
