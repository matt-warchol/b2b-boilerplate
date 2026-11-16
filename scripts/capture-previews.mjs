// Recaptures the landing-page screenshots from a running build (default http://localhost:3000).
// Run by .github/workflows/capture-previews.yml. Locally: npm run build && npm start, then
//   npm i --no-save playwright sharp && npx playwright install chromium && node scripts/capture-previews.mjs
import { chromium } from "playwright";
import sharp from "sharp";

const base = process.env.BASE_URL ?? "http://localhost:3000";
const save = (buf, name) => sharp(buf).webp({ quality: 82 }).toFile(`public/${name}.webp`);
const browser = await chromium.launch();

async function open(width, height, path) {
  const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto(base + path, { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);
  return page;
}

// Hero: CRM overview, desktop and mobile.
for (const [name, w, h] of [["crm-preview", 1512, 1100], ["crm-preview-mobile", 390, 844]]) {
  const page = await open(w, h, "/crm/overview");
  await save(await page.screenshot(), name);
  await page.context().close();
}

// Feature tiles: 860 x 540 crop starting at the page heading.
for (const [name, path] of [
  ["marketing-people", "/crm/people"],
  ["marketing-inbox", "/crm/inbox"],
  ["marketing-pipeline", "/crm/pipeline"],
  ["marketing-admin", "/admin"],
]) {
  const page = await open(1440, 900, path);
  const box = await page.locator("h1").first().boundingBox();
  const clip = { x: Math.max(0, box.x - 16), y: Math.max(0, box.y - 16), width: 860, height: 540 };
  await save(await page.screenshot({ clip }), name);
  await page.context().close();
}

// Campaigns tile: the campaign editor sheet, right-aligned crop.
{
  const page = await open(1440, 900, "/crm/campaigns");
  const row = page.getByText(/SaaS founders/i).first();
  await row.click();
  await page.waitForTimeout(1000);
  await save(await page.screenshot({ clip: { x: 1440 - 860, y: 0, width: 860, height: 540 } }), "marketing-campaigns");
  await page.context().close();
}

await browser.close();
console.log("Previews captured.");
