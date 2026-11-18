// Right-to-left guard for ui.css and the React direction icons. Run: pnpm test
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { rtlAudit, ALLOW, UI_CSS } from "./rtl-audit.mjs";

const css = readFileSync(UI_CSS, "utf8");
const rows = rtlAudit(css);

test("every physical-side declaration in ui.css has a right-to-left path or an allow-list reason", () => {
  const open = rows.filter((r) => !r.allowed).map((r) => `ui.css:${r.line} ${r.selector} { ${r.prop}: ${r.value} } (${r.kind})`);
  assert.deepEqual(open, [], `Use a logical property (inset-inline-*, margin-inline-*, padding-inline-*, border-inline-*, text-align: start/end), a [dir="rtl"] twin, or var(--uis-dir):\n${open.join("\n")}`);
});

test("every allow-list entry still matches a rule (no stale entries)", () => {
  ALLOW.forEach((a, i) => assert.ok(rows.some((r) => r.allowIndex === i), `ALLOW[${i}] matches nothing: ${a.reason}`));
});

test("the direction variable and the icon mirror exist", () => {
  assert.match(css, /\[dir="rtl"\]\s*\{\s*--uis-dir:\s*-1;\s*\}/);
  assert.match(css, /\[dir="ltr"\]\s*\{\s*--uis-dir:\s*1;\s*\}/);
  assert.match(css, /\[dir="rtl"\] \.uis-icon\[data-dir\]\s*\{\s*scale:\s*var\(--uis-dir\) 1;\s*\}/);
});

test("the audit bites: physical sides, text-align, shorthands, translateX and keyframes fail; logical, twins and --uis-dir pass", () => {
  const open = (src) => rtlAudit(src).filter((r) => !r.allowed).map((r) => r.kind);
  assert.deepEqual(open(".a { left: 4px; }"), ["side"]);
  assert.deepEqual(open(".a { margin-right: auto; }"), ["side"]);
  assert.deepEqual(open(".a { border-left: 1px solid red; }"), ["side"]);
  assert.deepEqual(open(".a { text-align: left; }"), ["text-align"]);
  assert.deepEqual(open(".a { padding: 0 10px 0 8px; }"), ["shorthand"]);
  assert.deepEqual(open(".a { transform: translateX(18px); }"), ["translateX"]);
  assert.deepEqual(open("@keyframes k { from { transform: translateX(24px); } }"), ["translateX"]);
  assert.deepEqual(open("@media (min-width: 1px) { .a { right: 0; } }"), ["side"]);
  assert.deepEqual(open(".a { inset-inline-start: 4px; margin-inline-end: auto; text-align: start; padding-inline: 8px 10px; }"), []);
  assert.deepEqual(open(".a { left: 0; right: 0; } .b { left: 50%; transform: translate(-50%, -50%); }"), []);
  assert.deepEqual(open(".a { transform: translateX(18px); } [dir=\"rtl\"] .a { transform: translateX(-18px); }"), []);
  assert.deepEqual(open("@keyframes k { from { translate: calc(24px * var(--uis-dir, 1)) 0; } }"), []);
  assert.deepEqual(open("@keyframes k { from { transform: translateY(8px) scale(0.9); } }"), []);
  assert.deepEqual(open(".uis-reveal { right: 4px; }"), [], "the password eye is allowed");
  assert.deepEqual(open(".uis-reveal-x { right: 4px; }"), ["side"], "the allow-list matches whole class names only");
  assert.deepEqual(open(".a { left: 4px; transform: translateX(4px); } [dir=\"rtl\"] .a { transform: translateX(-4px); }"), ["side"], "a twin covers only the properties it sets");
  assert.deepEqual(open(".a { border-radius: 8px 0; }"), ["shorthand"]);
  assert.deepEqual(open(".a { border-radius: 8px 8px 0 0; }"), []);
  assert.deepEqual(open(".a { transform-origin: left center; }"), ["side-keyword"]);
  assert.deepEqual(open(".a { background: linear-gradient(to right, red, blue); }"), ["gradient"]);
});

// Direction icons must be marked; neutral icons must not be.
const reactSrc = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../react/src");
const files = readdirSync(reactSrc, { recursive: true }).filter((f) => f.endsWith(".tsx")).map((f) => path.join(reactSrc, f));
// Whole <Icon … /> tags, so a prop holding `=>` does not cut the match short.
const icons = files.flatMap((f) => [...readFileSync(f, "utf8").matchAll(/<Icon\b([\s\S]*?)\/>/g)].map((m) => ({ file: path.basename(f), name: (m[1].match(/\bname="([^"]+)"/) ?? [])[1], directional: /\bdirectional\b/.test(m[1]) })).filter((i) => i.name));
const DIRECTION_NAMES = ["chevron-left", "chevron-right", "arrow-left", "arrow-right", "arrow-up-right", "arrow-up-left", "arrow-down-right", "arrow-down-left"];

test("direction icons in the React package carry `directional`", () => {
  const DIRECTION = /^(chevron-(left|right)|arrow-(left|right|up-right|up-left|down-right|down-left))$/;
  const missing = icons.filter((i) => DIRECTION.test(i.name) && !i.directional).map((i) => `${i.file}: ${i.name}`);
  assert.deepEqual(missing, []);
  assert.ok(icons.some((i) => i.directional), "at least the crumbs, sheet and menu icons are marked");
});

test("no direction icon name reaches the React UI any other way (icon=\"…\" props, strings)", () => {
  const stray = [];
  for (const f of files.filter((x) => path.basename(x) !== "Icon.tsx")) {
    const text = readFileSync(f, "utf8");
    for (const n of DIRECTION_NAMES) {
      const literals = text.split(`'${n}'`).length - 1 + text.split(`"${n}"`).length - 1;
      const marked = icons.filter((i) => i.file === path.basename(f) && i.name === n && i.directional).length;
      if (literals !== marked) stray.push(`${path.basename(f)}: ${n} (${literals} uses, ${marked} marked)`);
    }
  }
  assert.deepEqual(stray, []);
});

test("neutral icons never mirror", () => {
  const NEUTRAL = /^(moon|sun|x|search|eye|eye-off|check|plus|menu|bell|mail|user|home|settings|calendar|lock|chevron-(up|down)|chevrons-updown)$/;
  const wrong = icons.filter((i) => NEUTRAL.test(i.name) && i.directional).map((i) => `${i.file}: ${i.name}`);
  assert.deepEqual(wrong, []);
});
