import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { createHash } from "node:crypto";

// Small dependency-free source inventory. Precise inherited types live in the linked .tsx files.
const root = resolve(process.cwd());
const dir = join(root, "components", "ui");
const files = readdirSync(dir).filter((name) => name.endsWith(".tsx")).sort();
const doc = join(root, "docs", "design-system-docs.md");
const fingerprint = (source) => {
  const bytes = Buffer.from(source, "utf8");
  return createHash("sha1").update(`blob ${bytes.length}\0`).update(bytes).digest("hex");
};
const markers = files.map((name) => `<!-- ui-catalog ${name} ${fingerprint(readFileSync(join(dir, name), "utf8"))} -->`);
if (process.argv.includes("--check")) {
  const content = readFileSync(doc, "utf8");
  const missing = files.filter((name, i) => !content.includes("](../components/ui/" + name + ")") || !content.includes(markers[i]));
  if (missing.length) {
    console.error("Unlisted or changed UI modules: " + missing.join(", ") + ". Run npm run ui:catalog and commit the updated catalog.");
    process.exitCode = 1;
  } else {
    console.log("Installed UI module inventory and source fingerprints are current.");
  }
} else {
  function exportedNames(src) {
    const result = new Set();
    for (const match of src.matchAll(/export\s*\{([\s\S]*?)\}/g)) {
      for (const item of match[1].split(",")) {
        const name = item.trim().replace(/^type\s+/, "").split(/\s+as\s+/).at(-1)?.trim();
        if (name && /^[A-Z][\w$]*$/.test(name)) result.add(name);
      }
    }
    for (const match of src.matchAll(/export\s+(?:function|const|type|interface)\s+([A-Z][\w$]*)/g)) result.add(match[1]);
    return [...result].sort();
  }
  function propSignature(src, name) {
    const match = new RegExp("\\bfunction\\s+" + name + "\\s*\\(").exec(src);
    if (!match) return "See source (exported alias/type)";
    let pos = match.index + match[0].length, depth = 1;
    const start = pos;
    for (; pos < src.length; pos++) {
      if (src[pos] === "(") depth++;
      if (src[pos] === ")" && --depth === 0) break;
    }
    const raw = src.slice(start, pos).replace(/\s+/g, " ");
    const at = raw.lastIndexOf("}:");
    const type = at >= 0 ? raw.slice(at + 2).trim() : raw;
    return type.replaceAll("|", "\\|").replaceAll("`", "'");
  }
  const out = [
    "# Design system: installed components and props",
    "",
    "> Auto-generated from local `components/ui/*.tsx`. Do not hand-edit; refresh with `npm run ui:catalog`. See [DESIGN.md](../DESIGN.md) for preferred upstream libraries and [USING-WITH-AI.md](USING-WITH-AI.md) for agent workflows.",
    "",
    "Inherited React and Radix props are defined in their TypeScript packages. The signatures below capture the source annotations; they are not a substitute for running TypeScript.",
    "",
    "| Installed source | Export | Props signature / source type |",
    "| --- | --- | --- |",
  ];
  for (const name of files) {
    const src = readFileSync(join(dir, name), "utf8");
    for (const symbol of exportedNames(src)) {
      out.push("| [`" + name + "`](../components/ui/" + name + ") | `" + symbol + "` | `" + propSignature(src, symbol) + "` |");
    }
  }
  out.push("", "For reusable product-specific compositions see [marketing blocks](../components/marketing/blocks.tsx), [feedback agent](FEEDBACK.md), [CRM dashboard shell](../features/crm/dashboard-shell.tsx), [pipeline](../features/crm/pipeline-board.tsx) and [charts](../features/crm/outbound-chart.tsx).", "", ...markers, "");
  writeFileSync(doc, out.join("\n"));
  console.log("Wrote " + doc);
}
