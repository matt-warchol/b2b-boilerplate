// Builds content/product-map.generated.md from the code, so the Feedback agent's knowledge follows the product.
// Runs before every build (npm run build). Safe to run by hand: node scripts/product-map.mjs
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (p) => (existsSync(path.join(root, p)) ? readFileSync(path.join(root, p), "utf8") : "");
const out = ["# Product map (generated, do not edit)", ""];

// CRM screens
const crmPage = read("app/crm/[view]/page.tsx");
const views = [...(crmPage.match(/const views = \[([\s\S]*?)\]/)?.[1].matchAll(/"([\w-]+)"/g) ?? [])].map((m) => m[1]);
const titleBlock = read("features/crm/crm.tsx").match(/const titles[^=]*=\s*\{([\s\S]*?)\};/)?.[1] ?? "";
const crmTitles = Object.fromEntries([...titleBlock.matchAll(/(\w+): "([^"]+)"/g)].map((m) => [m[1], m[2]]));
if (views.length) {
  out.push("## CRM screens", ...views.map((v) => `- /crm/${v}: ${crmTitles[v] ?? v}`), "");
}

// Workspace navigation
const nav = [...read("components/workspace-nav.tsx").matchAll(/href: "([^"]+)", label: "([^"]+)"/g)];
if (nav.length) out.push("## Workspace navigation", ...nav.map((m) => `- ${m[1]}: ${m[2]}`), "");

// All page routes
function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : name === "page.tsx" ? [full] : [];
  });
}
const routes = walk(path.join(root, "app"))
  .map((f) => "/" + path.relative(path.join(root, "app"), path.dirname(f)).split(path.sep).filter((s) => !/^\(.*\)$/.test(s)).join("/"))
  .map((r) => r.replace(/\/$/, "") || "/")
  .sort();
out.push("## Pages", ...routes.map((r) => `- ${r}`), "");

// FAQ and styles
const faq = [...read("content/site.ts").matchAll(/question:\s*"([^"]+)",\s*answer:\s*"([^"]+)"/g)];
if (faq.length) out.push("## Published FAQ", ...faq.map((m) => `- Q: ${m[1]}\n  A: ${m[2]}`), "");
const themes = [...read("content/themes.ts").matchAll(/name: "([^"]+)", description: "([^"]+)"/g)];
if (themes.length) out.push("## Visual styles", ...themes.map((m) => `- ${m[1]}: ${m[2]}`), "");

writeFileSync(path.join(root, "content/product-map.generated.md"), out.join("\n"));
console.log("product-map: wrote", out.length, "lines");
