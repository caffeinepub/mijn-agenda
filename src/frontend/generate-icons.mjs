/**
 * Icon generator for Mijn Agenda PWA
 * Generates PNG icons from the SVG source using sharp.
 *
 * Run: node generate-icons.mjs
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, "public");
const svgPath = join(publicDir, "icon.svg");

async function main() {
  const { default: sharp } = await import("sharp");
  console.log("🎨 Generating PWA icons for Mijn Agenda...\n");

  const svgBuffer = readFileSync(svgPath);

  const sizes = [
    { name: "icon-192.png", size: 192 },
    { name: "icon-512.png", size: 512 },
    { name: "apple-touch-icon.png", size: 180 },
  ];

  for (const { name, size } of sizes) {
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(join(publicDir, name));
    console.log(`✓ Generated ${name} (${size}x${size})`);
  }

  // Maskable icon — add extra padding (safe zone ~10% each side)
  const padding = Math.round(512 * 0.1);
  const innerSize = 512 - padding * 2;
  await sharp(svgBuffer)
    .resize(innerSize, innerSize)
    .extend({
      top: padding,
      bottom: padding,
      left: padding,
      right: padding,
      background: { r: 30, g: 27, b: 46, alpha: 1 },
    })
    .png()
    .toFile(join(publicDir, "icon-maskable-512.png"));
  console.log("✓ Generated icon-maskable-512.png (512x512 with safe zone)");

  // favicon.ico via 32px PNG (browsers accept .png renamed to .ico too, but we'll use ico-proper)
  const favicon32 = await sharp(svgBuffer).resize(32, 32).png().toBuffer();
  // Write favicon as PNG-based (modern browsers support it)
  const { writeFileSync } = await import("node:fs");
  writeFileSync(join(publicDir, "favicon.ico"), favicon32);
  console.log("✓ Generated favicon.ico (32x32)");

  console.log("\n✅ All icons generated successfully!");
}

main().catch((err) => {
  console.error("❌ Icon generation failed:", err.message);
  process.exit(1);
});
