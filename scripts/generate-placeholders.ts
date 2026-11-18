/**
 * Generates the placeholder product art in /public/products.
 *
 * Run with: npm run placeholders
 *
 * Everything it draws is original vector art built from the colorway palettes
 * in src/config/site.ts. Replace the files (or point the config at new paths)
 * once you have real product photography.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { site, type Colorway } from "../src/config/site";

type Palette = Colorway["palette"];

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "public", "products");
const brand = site.brand.name;
const { ink2, ink3, frost } = site.theme.colors;

const svg = (w: number, h: number, body: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">${body}</svg>\n`;

/** Soft top-left light, bottom-right shadow. Shared by every piece. */
const shadeDefs = (id: string) => `
  <radialGradient id="${id}-sh" cx="0.28" cy="0.2" r="1">
    <stop offset="0" stop-color="#fff" stop-opacity="0.3"/>
    <stop offset="0.45" stop-color="#000" stop-opacity="0"/>
    <stop offset="1" stop-color="#000" stop-opacity="0.5"/>
  </radialGradient>`;

const label = (p: Palette, x: number, y: number, scale = 1) => `
  <g transform="translate(${x} ${y}) scale(${scale})">
    <rect x="-56" y="-27" width="112" height="54" rx="5" fill="${p.pad}"/>
    <rect x="-50" y="-21" width="100" height="42" rx="3" fill="none" stroke="${p.padInk}" stroke-opacity="0.35" stroke-width="2" stroke-dasharray="4 4"/>
    <text y="10" text-anchor="middle" font-family="Impact, 'Arial Narrow Bold', 'Arial Narrow', Arial, sans-serif" font-weight="900" font-size="28" letter-spacing="3" fill="${p.padInk}">${brand}</text>
  </g>`;

/* ------------------------------------------------------------------ */
/* Beanie (800 x 800)                                                  */
/* ------------------------------------------------------------------ */
function beanie(p: Palette, id: string) {
  const dome = "M 168 500 C 158 300 262 148 400 148 C 538 148 642 300 632 500 Z";
  const cuff = "M 150 472 Q 400 440 650 472 L 643 612 Q 400 662 157 612 Z";
  let domeRibs = "";
  for (let i = -10; i <= 10; i++) {
    domeRibs += `<path d="M ${400 + i * 25} 500 Q ${400 + i * 23} 300 ${400 + i * 4} 150"/>`;
  }
  let cuffRibs = "";
  for (let x = 150; x <= 650; x += 20) {
    cuffRibs += `<path d="M ${x} 440 L ${400 + (x - 400) * 0.985} 665"/>`;
  }
  return `
  <defs>
    ${shadeDefs(id)}
    <clipPath id="${id}-dome"><path d="${dome}"/></clipPath>
    <clipPath id="${id}-cuff"><path d="${cuff}"/></clipPath>
  </defs>
  <path d="${dome}" fill="${p.base}"/>
  <g clip-path="url(#${id}-dome)">
    <g fill="none" stroke="${p.shade}" stroke-opacity="0.5" stroke-width="7">${domeRibs}</g>
    <g fill="none" stroke="${p.light}" stroke-opacity="0.35" stroke-width="3" transform="translate(6 0)">${domeRibs}</g>
    <path d="M 140 500 Q 400 462 660 500 L 660 440 Q 400 400 140 440 Z" fill="#000" opacity="0.28"/>
  </g>
  <path d="${dome}" fill="url(#${id}-sh)"/>
  <path d="${cuff}" fill="${p.base}" stroke="${p.base}" stroke-width="22" stroke-linejoin="round"/>
  <g clip-path="url(#${id}-cuff)">
    <g fill="none" stroke="${p.shade}" stroke-opacity="0.55" stroke-width="7">${cuffRibs}</g>
    <g fill="none" stroke="${p.light}" stroke-opacity="0.4" stroke-width="3" transform="translate(6 0)">${cuffRibs}</g>
  </g>
  <path d="${cuff}" fill="url(#${id}-sh)" stroke="url(#${id}-sh)" stroke-width="22" stroke-linejoin="round"/>
  ${label(p, 400, 556)}`;
}

/* ------------------------------------------------------------------ */
/* Neck warmer (800 x 800)                                             */
/* ------------------------------------------------------------------ */
function neck(p: Palette, id: string) {
  const body =
    "M 188 272 C 170 380 174 500 196 612 Q 400 672 604 612 C 626 500 630 380 612 272 Z";
  let ribs = "";
  for (let x = 180; x <= 620; x += 21) {
    const d = (x - 400) * 0.04;
    ribs += `<path d="M ${x} 250 Q ${x - d * 3} 440 ${x + d} 680"/>`;
  }
  return `
  <defs>
    ${shadeDefs(id)}
    <clipPath id="${id}-body"><path d="${body}"/></clipPath>
    <linearGradient id="${id}-in" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#000" stop-opacity="0.55"/>
      <stop offset="1" stop-color="#000" stop-opacity="0.05"/>
    </linearGradient>
  </defs>
  <path d="${body}" fill="${p.base}"/>
  <g clip-path="url(#${id}-body)">
    <g fill="none" stroke="${p.shade}" stroke-opacity="0.5" stroke-width="7">${ribs}</g>
    <g fill="none" stroke="${p.light}" stroke-opacity="0.35" stroke-width="3" transform="translate(6 0)">${ribs}</g>
  </g>
  <path d="${body}" fill="url(#${id}-sh)"/>
  <ellipse cx="400" cy="272" rx="212" ry="66" fill="${p.base}"/>
  <ellipse cx="400" cy="272" rx="212" ry="66" fill="url(#${id}-sh)"/>
  <ellipse cx="400" cy="278" rx="186" ry="48" fill="${p.lining}"/>
  <ellipse cx="400" cy="278" rx="186" ry="48" fill="url(#${id}-in)"/>
  <path d="M 214 278 A 186 48 0 0 0 586 278" fill="none" stroke="${p.light}" stroke-opacity="0.5" stroke-width="3"/>
  ${label(p, 520, 560, 0.7)}`;
}

/* ------------------------------------------------------------------ */
/* Gloves (800 x 800, a pair)                                          */
/* ------------------------------------------------------------------ */
function gloves(p: Palette, id: string) {
  const fingerX = [48, 98, 148, 198];
  const fingerTop = [62, 30, 48, 104];
  const fingers = fingerX
    .map((x, i) => `<rect x="${x}" y="${fingerTop[i]}" width="44" height="${300 - fingerTop[i]}" rx="22"/>`)
    .join("");
  const thumb = `<rect x="-24" y="-128" width="50" height="160" rx="25" transform="translate(54 338) rotate(-34)"/>`;
  let cuffRibs = "";
  for (let x = 62; x <= 232; x += 14) cuffRibs += `<path d="M ${x} 408 V 530"/>`;
  const shape = `${fingers}${thumb}<rect x="40" y="228" width="212" height="200" rx="50"/><rect x="58" y="404" width="176" height="124" rx="16"/>`;
  const one = `
    <use href="#${id}-shape" fill="${p.base}"/>
    <g fill="${p.pad}">
      <path d="M 48 84 a 22 22 0 0 1 44 0 v 30 h -44 z"/>
      <path d="M -24 -103 a 25 25 0 0 1 50 0 v 26 h -50 z" transform="translate(54 338) rotate(-34)"/>
    </g>
    <g fill="none" stroke="${p.shade}" stroke-opacity="0.5" stroke-width="5" clip-path="url(#${id}-cuff)">${cuffRibs}</g>
    <path d="M 58 416 H 234" stroke="${p.shade}" stroke-opacity="0.6" stroke-width="5"/>
    <rect width="300" height="540" fill="url(#${id}-sh)" mask="url(#${id}-mask)"/>`;
  return `
  <defs>
    ${shadeDefs(id)}
    <g id="${id}-shape">${shape}</g>
    <mask id="${id}-mask"><use href="#${id}-shape" fill="#fff"/></mask>
    <clipPath id="${id}-cuff"><rect x="58" y="404" width="176" height="124" rx="16"/></clipPath>
  </defs>
  <g transform="translate(118 138) rotate(-9 150 270)">${one}</g>
  <g transform="translate(682 138) scale(-1 1) rotate(-9 150 270)">${one}</g>`;
}

/* ------------------------------------------------------------------ */
/* 4:5 tiles (1000 x 1250)                                             */
/* ------------------------------------------------------------------ */
const caption = (text: string, right: string) => `
  <g font-family="ui-monospace, Menlo, Consolas, monospace" font-size="20" letter-spacing="3" fill="${frost}" fill-opacity="0.55">
    <text x="48" y="1202">${text}</text>
    <text x="952" y="66" text-anchor="end">${right}</text>
  </g>`;

const backdrop = (id: string, glow: string) => `
  <defs>
    <linearGradient id="${id}-bg" x1="0" y1="0" x2="0.4" y2="1">
      <stop offset="0" stop-color="${ink3}"/>
      <stop offset="1" stop-color="${ink2}"/>
    </linearGradient>
    <radialGradient id="${id}-glow" cx="0.5" cy="0.42" r="0.6">
      <stop offset="0" stop-color="${glow}" stop-opacity="0.22"/>
      <stop offset="1" stop-color="${glow}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="${id}-vig" cx="0.5" cy="0.5" r="0.75">
      <stop offset="0.55" stop-color="#000" stop-opacity="0"/>
      <stop offset="1" stop-color="#000" stop-opacity="0.55"/>
    </radialGradient>
  </defs>
  <rect width="1000" height="1250" fill="url(#${id}-bg)"/>
  <rect width="1000" height="1250" fill="url(#${id}-glow)"/>`;

function setTile(c: Colorway) {
  const p = c.palette;
  return svg(
    1000,
    1250,
    `${backdrop("t", p.light)}
    <g transform="translate(214 40) scale(0.715)">${beanie(p, "b")}</g>
    <g transform="translate(262 420) scale(0.595)">${neck(p, "n")}</g>
    <g transform="translate(232 716) scale(0.67)">${gloves(p, "g")}</g>
    <rect width="1000" height="1250" fill="url(#t-vig)"/>
    ${caption("PLACEHOLDER / FULL SET / 4:5", c.name.toUpperCase())}`,
  );
}

function knitTile(c: Colorway) {
  const p = c.palette;
  return svg(
    1000,
    1250,
    `${backdrop("t", p.light)}
    <defs>
      <pattern id="k" width="120" height="92" patternUnits="userSpaceOnUse" patternTransform="rotate(-8 500 625)">
        <rect width="120" height="92" fill="${p.shade}"/>
        <path d="M 10 -40 Q 34 20 56 52" fill="none" stroke="${p.base}" stroke-width="40" stroke-linecap="round"/>
        <path d="M 110 -40 Q 86 20 64 52" fill="none" stroke="${p.base}" stroke-width="40" stroke-linecap="round"/>
        <path d="M 10 52 Q 34 112 56 144" fill="none" stroke="${p.base}" stroke-width="40" stroke-linecap="round"/>
        <path d="M 110 52 Q 86 112 64 144" fill="none" stroke="${p.base}" stroke-width="40" stroke-linecap="round"/>
        <path d="M 16 -30 Q 34 16 50 40" fill="none" stroke="${p.light}" stroke-opacity="0.55" stroke-width="6" stroke-linecap="round"/>
        <path d="M 16 62 Q 34 108 50 132" fill="none" stroke="${p.light}" stroke-opacity="0.55" stroke-width="6" stroke-linecap="round"/>
      </pattern>
      <linearGradient id="kl" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#fff" stop-opacity="0.18"/>
        <stop offset="0.5" stop-color="#000" stop-opacity="0"/>
        <stop offset="1" stop-color="#000" stop-opacity="0.5"/>
      </linearGradient>
    </defs>
    <rect x="-100" y="-100" width="1200" height="1450" fill="url(#k)"/>
    <rect width="1000" height="1250" fill="url(#kl)"/>
    <rect width="1000" height="1250" fill="url(#t-vig)"/>
    ${caption("PLACEHOLDER / KNIT CLOSE-UP / 4:5", c.name.toUpperCase())}`,
  );
}

function fleeceTile(c: Colorway) {
  const p = c.palette;
  return svg(
    1000,
    1250,
    `${backdrop("t", p.light)}
    <defs>
      <filter id="fz" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.035 0.05" numOctaves="4" seed="7" result="n"/>
        <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0.9 0.6 0 0 -0.45"/>
      </filter>
      <filter id="fg" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="2" seed="3" result="n"/>
        <feColorMatrix in="n" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.9 -0.35"/>
      </filter>
      <linearGradient id="fl" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#fff" stop-opacity="0.12"/>
        <stop offset="1" stop-color="#000" stop-opacity="0.45"/>
      </linearGradient>
    </defs>
    <rect width="1000" height="1250" fill="${p.lining}"/>
    <rect width="1000" height="1250" filter="url(#fz)" opacity="0.5"/>
    <rect width="1000" height="1250" filter="url(#fg)" opacity="0.35"/>
    <rect width="1000" height="1250" fill="url(#fl)"/>
    <rect width="1000" height="1250" fill="url(#t-vig)"/>
    ${caption("PLACEHOLDER / FLEECE CLOSE-UP / 4:5", c.name.toUpperCase())}`,
  );
}

function touchTile(c: Colorway) {
  const p = c.palette;
  let ribs = "";
  for (let x = 300; x <= 700; x += 34) ribs += `<path d="M ${x} 520 V 1300"/>`;
  let rings = "";
  for (let i = 1; i <= 4; i++) {
    rings += `<circle cx="500" cy="330" r="${150 + i * 90}" fill="none" stroke="${frost}" stroke-opacity="${0.3 - i * 0.055}" stroke-width="2"/>`;
  }
  return svg(
    1000,
    1250,
    `${backdrop("t", p.light)}
    <defs>
      ${shadeDefs("f")}
      <clipPath id="fc"><rect x="290" y="150" width="420" height="1300" rx="210"/></clipPath>
    </defs>
    ${rings}
    <rect x="290" y="150" width="420" height="1300" rx="210" fill="${p.base}"/>
    <g clip-path="url(#fc)">
      <g fill="none" stroke="${p.shade}" stroke-opacity="0.5" stroke-width="10">${ribs}</g>
      <rect x="290" y="150" width="420" height="330" fill="${p.pad}"/>
      <path d="M 290 480 H 710" stroke="${p.shade}" stroke-opacity="0.6" stroke-width="8"/>
      <g fill="${p.padInk}" fill-opacity="0.22">
        ${Array.from({ length: 5 }, (_, r) =>
          Array.from({ length: 7 }, (_, col) => `<circle cx="${350 + col * 50}" cy="${250 + r * 48}" r="7"/>`).join(""),
        ).join("")}
      </g>
    </g>
    <rect x="290" y="150" width="420" height="1300" rx="210" fill="url(#f-sh)"/>
    <rect width="1000" height="1250" fill="url(#t-vig)"/>
    ${caption("PLACEHOLDER / FINGERTIP CLOSE-UP / 4:5", c.name.toUpperCase())}`,
  );
}

/* ------------------------------------------------------------------ */

let count = 0;
const write = (colorway: string, file: string, contents: string) => {
  const path = join(outDir, colorway, file);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, contents.replace(/\n\s+/g, "\n"));
  count++;
};

for (const c of site.colorways) {
  write(c.id, "beanie.svg", svg(800, 800, beanie(c.palette, "b")));
  write(c.id, "neck.svg", svg(800, 800, neck(c.palette, "n")));
  write(c.id, "gloves.svg", svg(800, 800, gloves(c.palette, "g")));
  write(c.id, "set.svg", setTile(c));
  write(c.id, "detail-knit.svg", knitTile(c));
  write(c.id, "detail-fleece.svg", fleeceTile(c));
  write(c.id, "detail-touch.svg", touchTile(c));
}

console.log(`Wrote ${count} placeholder images to public/products`);
