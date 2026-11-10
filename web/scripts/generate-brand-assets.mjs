#!/usr/bin/env node
/**
 * Draws the placeholder brand assets: favicon.ico, apple-icon.png and
 * opengraph-image.png in src/app. They are placeholders until the brand
 * owner supplies the official mark (decision D-4): a "C" on the Dark page
 * background in the Dark accent, and a social card with the wordmark, the
 * tagline and a block of game pixels. Colours are the design tokens.
 *
 * Usage: node scripts/generate-brand-assets.mjs
 * Needs Playwright's Chromium (already a dev dependency).
 */
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const APP = join(fileURLToPath(new URL(".", import.meta.url)), "../src/app");
const BG = "#0f0e17";
const INK = "#f5f6fa";
const ACCENT = "#0ff0fc";
const BRAND = "#e94560";
const RETRO = "#ff8e3c";
const FONT = "Inter, 'DejaVu Sans', Arial, sans-serif";

// The tile is a div, not the body: a body background would spread to the
// whole canvas and the corners would not be transparent.
const icon = (size) => `
  <body style="margin:0;background:transparent">
    <div style="width:${size}px;height:${size}px;background:${BG};border-radius:${Math.round(size * 0.2)}px;display:flex;align-items:center;justify-content:center">
      <div style="font:700 ${Math.round(size * 0.72)}px ${FONT};color:${ACCENT};line-height:1;margin-top:-${Math.round(size * 0.04)}px">C</div>
    </div>
  </body>`;

const PIXELS = [
  "....11....",
  "...1111...",
  "..........",
  ".22....33.",
  ".22...333.",
  "2222.33333",
];
const FILL = { 1: ACCENT, 2: BRAND, 3: RETRO };
const pixels = PIXELS.map(
  (row) =>
    `<div style="display:flex">${[...row]
      .map(
        (cell) =>
          `<div style="width:36px;height:36px;background:${FILL[cell] ?? "transparent"}"></div>`,
      )
      .join("")}</div>`,
).join("");

const card = `
  <body style="margin:0;width:1200px;height:630px;background:${BG};display:flex;align-items:center;justify-content:space-between;padding:0 88px;box-sizing:border-box;font-family:${FONT}">
    <div>
      <div style="font-weight:700;font-size:44px;color:${ACCENT}">Consoless</div>
      <div style="font-weight:700;font-size:72px;line-height:1.1;color:${INK};margin-top:24px;max-width:600px">Describe it. Play it. Share it.</div>
      <div style="font-size:28px;color:${INK};opacity:.72;margin-top:24px">Open-source. Make a game by describing it.</div>
    </div>
    <div>${pixels}</div>
  </body>`;

/** A minimal ICO container around PNG images. */
function ico(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  const entries = [];
  let offset = 6 + images.length * 16;
  for (const { size, png } of images) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size === 256 ? 0 : size, 0);
    entry.writeUInt8(size === 256 ? 0 : size, 1);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(png.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += png.length;
    entries.push(entry);
  }
  return Buffer.concat([
    header,
    ...entries,
    ...images.map((image) => image.png),
  ]);
}

const browser = await chromium.launch(
  process.env.PW_CHROME ? { executablePath: process.env.PW_CHROME } : {},
);
async function shot(html, width, height) {
  const page = await browser.newPage({
    viewport: { width, height },
    deviceScaleFactor: 1,
  });
  await page.setContent(`<!doctype html><html>${html}</html>`);
  // The rounded corners are transparent (omitBackground), which makes the
  // PNG RGBA: ICO decoders reject RGB PNGs.
  const png = await page.screenshot({ type: "png", omitBackground: true });
  await page.close();
  return png;
}

const sizes = [16, 32, 48, 256];
const images = [];
for (const size of sizes)
  images.push({ size, png: await shot(icon(size), size, size) });
writeFileSync(join(APP, "favicon.ico"), ico(images));
writeFileSync(join(APP, "apple-icon.png"), await shot(icon(180), 180, 180));
writeFileSync(join(APP, "opengraph-image.png"), await shot(card, 1200, 630));
await browser.close();
console.log("Wrote favicon.ico, apple-icon.png and opengraph-image.png");
