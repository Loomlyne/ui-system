// RTL audit for UI System's ui.css. Every declaration tied to the physical left or right (or to an x translation)
// must have a right-to-left path: a logical property, a [dir="rtl"] / :dir(rtl) twin of the same selector, or the
// --uis-dir variable. The parser comes from ALMAR's scripts/uis-rtl-audit.mjs (phase 19-02); the allow-list and the
// --uis-dir rule are UI System's. Run: node packages/core/test/rtl-audit.mjs [path/to/ui.css]
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SIDE = /^(left|right|margin-left|margin-right|padding-left|padding-right|border-(?:left|right)(?:-[a-z]+)?|border-(?:top|bottom)-(?:left|right)-radius)$/;

/** Split a declaration block on top-level `;` (parentheses and quotes stay whole). */
function declarations(body) {
  const out = [];
  let depth = 0, cur = "", quote = null;
  for (const ch of body) {
    if (quote) { cur += ch; if (ch === quote) quote = null; continue; }
    if (ch === '"' || ch === "'") { quote = ch; cur += ch; continue; }
    if (ch === "(") depth += 1;
    if (ch === ")") depth -= 1;
    if (ch === ";" && depth === 0) { out.push(cur); cur = ""; continue; }
    cur += ch;
  }
  if (cur.trim()) out.push(cur);
  return out
    .map((d) => { const i = d.indexOf(":"); return i === -1 ? null : { prop: d.slice(0, i).trim().toLowerCase(), value: d.slice(i + 1).trim() }; })
    .filter(Boolean);
}

/** Every rule of a stylesheet with its 1-based line, selector list, declarations and the at-rule it sits in. */
export function parseRules(css) {
  const rules = [];
  const lineAt = (i) => css.slice(0, i).split("\n").length;
  const walk = (src, offset, atRule) => {
    let i = 0;
    while (i < src.length) {
      if (src.startsWith("/*", i)) { const e = src.indexOf("*/", i + 2); i = e === -1 ? src.length : e + 2; continue; }
      const open = src.indexOf("{", i);
      if (open === -1) break;
      // comments become blanks of the same length, so the line of the selector stays exact
      const prelude = src.slice(i, open).replace(/\/\*[\s\S]*?\*\//g, (m) => " ".repeat(m.length));
      const lead = prelude.length - prelude.trimStart().length;
      let depth = 1, j = open + 1;
      while (j < src.length && depth > 0) { if (src[j] === "{") depth += 1; else if (src[j] === "}") depth -= 1; j += 1; }
      const body = src.slice(open + 1, j - 1);
      const pre = prelude.trim();
      const line = lineAt(offset + i + lead);
      if (pre.startsWith("@")) {
        if (/^@(media|supports|layer|container)\b/.test(pre)) walk(body, offset + open + 1, pre);
        else if (/^@keyframes\b/.test(pre)) rules.push({ line, selectors: [pre], decls: [], keyframes: body, atRule });
      } else {
        rules.push({ line, selectors: pre.split(",").map((s) => s.trim().replace(/\s+/g, " ")), decls: declarations(body.replace(/\/\*[\s\S]*?\*\//g, "")), atRule });
      }
      i = j;
    }
  };
  walk(css, 0, null);
  return rules;
}

const RTL_SELECTOR = /\[dir=["']?rtl["']?\]|:dir\(\s*rtl\s*\)|:lang\(ar\)/;
const stripRtl = (s) => s.replace(/\[dir=["']?rtl["']?\]|:dir\(\s*rtl\s*\)|:lang\(ar\)/g, "").replace(/\s+/g, " ").trim();
const sameSide = (a, b) => a !== undefined && b !== undefined && a.value === b.value;

/** Split a value on top-level whitespace (function calls stay whole). */
function topLevelParts(value) {
  const parts = [];
  let depth = 0, cur = "";
  for (const ch of value.trim()) {
    if (ch === "(") depth += 1;
    if (ch === ")") depth -= 1;
    if (/\s/.test(ch) && depth === 0) { if (cur) parts.push(cur); cur = ""; continue; }
    cur += ch;
  }
  if (cur) parts.push(cur);
  return parts;
}

/** Shorthand values with four parts whose left and right part differ (margin, padding, inset, border-radius). */
function asymmetricShorthand(prop, value) {
  if (!/^(margin|padding|inset|border-radius)$/.test(prop)) return false;
  const parts = topLevelParts(value.split("/")[0]);
  if (prop === "border-radius") {
    if (parts.length < 2) return false;
    const [tl, tr = tl, br = tl, bl = tr] = parts; // CSS corner order
    return tl !== tr || br !== bl;
  }
  if (parts.length !== 4) return false;
  return parts[1] !== parts[3];
}


/**
 * Physical on purpose, each with its reason. A rule here passes; an entry that matches nothing fails the test,
 * so the list cannot go stale.
 */
export const ALLOW = [
  { selector: /\.uis-control--reveal(?![\w-])|\.uis-reveal(?![\w-])/, reason: "Password show/hide eye: physical right in every direction (owner rule). The whole password control stays physical so nothing lands on the eye." },
  { selector: /^\.uis-overlaymenu__links a \.uis-icon$/, kind: "translateX", reason: "The menu arrow is data-dir: its scale mirror, applied after transform, also flips this offset in right-to-left (measured: -8px LTR, +8px RTL)." },
  { selector: /\[data-placement="right"\]/, kind: "row-reverse", reason: "Logo placement is logical (left = start, right = end), docs/rtl.md. row-reverse follows the direction, so it is already right in RTL." },
];

const usesDir = (v) => /var\(--uis-dir\b/.test(v);

/** Every physical-side declaration without an RTL path, with `allowed` set to the ALLOW reason when it is on purpose. */
export function rtlAudit(cssText) {
  const rules = parseRules(cssText);
  // A twin covers only the properties it sets: selector -> Set(prop).
  const twins = new Map();
  for (const r of rules) for (const sel of r.selectors.filter((x) => RTL_SELECTOR.test(x))) {
    const key = stripRtl(sel); if (!twins.has(key)) twins.set(key, new Set());
    for (const d of r.decls) twins.get(key).add(d.prop);
  }
  const found = [];
  for (const rule of rules) {
    if (rule.keyframes !== undefined) {
      const name = rule.selectors[0].replace(/^@keyframes\s+/, "");
      // an x movement in a keyframe must scale with --uis-dir
      const movesX = (prop, v) => (prop === "transform" ? /translateX\(|translate3?d?\(\s*-?[\d.]*[1-9]/.test(v) : !/^\s*(none|0(px)?(\s|$))/.test(v));
      const moves = [...rule.keyframes.matchAll(/(transform|translate)\s*:\s*([^;}]+)/g)].filter(([, p, v]) => movesX(p, v));
      for (const [, prop, value] of moves) if (!usesDir(value)) found.push({ line: rule.line, selector: `@keyframes ${name}`, prop, value: value.trim(), kind: "translateX" });
      continue;
    }
    for (const selector of rule.selectors) {
      if (RTL_SELECTOR.test(selector)) continue;
      const twinProps = twins.get(selector) ?? new Set();
      const byProp = Object.fromEntries(rule.decls.map((d) => [d.prop, d]));
      const centre = /translate(?:X)?\(\s*-50%/.test(`${byProp.transform?.value ?? ""} ${byProp.translate?.value ?? ""}`);
      for (const d of rule.decls) {
        if (twinProps.has(d.prop)) continue;
        let kind = null;
        if (SIDE.test(d.prop)) {
          const mate = d.prop.includes("left") ? d.prop.replace("left", "right") : d.prop.replace("right", "left");
          if (sameSide(d, byProp[mate])) continue;
          if ((d.prop === "left" || d.prop === "right") && d.value === "50%" && centre) continue;
          kind = "side";
        } else if (d.prop === "text-align" && /^(left|right)$/.test(d.value)) kind = "text-align";
        else if ((d.prop === "float" || d.prop === "clear") && /^(left|right)$/.test(d.value)) kind = "float";
        else if (asymmetricShorthand(d.prop, d.value)) kind = "shorthand";
        else if (/^(transform-origin|background-position(-x)?|perspective-origin|object-position)$/.test(d.prop) && /\b(left|right)\b/.test(d.value)) kind = "side-keyword";
        else if (/gradient\(\s*to\s+(?:(?:top|bottom)\s+)?(left|right)\b/.test(d.value)) kind = "gradient";
        else if (/(^|[^a-z])translateX\(/.test(d.value) || /(^|[^a-z])translate3?d?\(\s*-?[\d.]*[1-9][\d.]*(px|em|rem|%)/.test(d.value) || (d.prop === "translate" && /^-?\d/.test(d.value) && !/^0[ p]/.test(d.value))) {
          if (!(centre && /translateX\(-50%\)|translate\(-50%/.test(d.value)) && !usesDir(d.value)) kind = "translateX";
        } else if (d.prop === "flex-direction" && d.value === "row-reverse" && /data-placement/.test(selector)) kind = "row-reverse";
        if (!kind) continue;
        const allow = ALLOW.find((a) => a.selector.test(selector) && (!a.kind || a.kind === kind));
        found.push({ line: rule.line, selector, prop: d.prop, value: d.value, kind, allowed: allow?.reason ?? null, allowIndex: allow ? ALLOW.indexOf(allow) : -1 });
      }
    }
  }
  return found;
}

export const UI_CSS = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../styles/ui.css");

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const file = process.argv[2] ?? UI_CSS;
  const rows = rtlAudit(readFileSync(file, "utf8"));
  const open = rows.filter((r) => !r.allowed);
  console.log(`${file}\n${rows.length} physical-side declarations: ${open.length} without an RTL path, ${rows.length - open.length} allowed`);
  for (const r of rows) console.log(`${String(r.line).padStart(4)}  ${(r.allowed ? "allowed" : "OPEN").padEnd(8)} ${r.kind.padEnd(11)} ${r.selector.slice(0, 64).padEnd(64)} ${r.prop}: ${r.value.slice(0, 40)}`);
  process.exit(open.length ? 1 : 0);
}
