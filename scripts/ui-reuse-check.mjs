#!/usr/bin/env node
/**
 * A deterministic PR guard for accidental UI duplication.
 * It looks at lines added by this PR and compares TSX declarations/semantics
 * against the exact exports in components/ui. It makes no network or AI calls.
 */
import ts from "typescript";
import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync, existsSync, appendFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const sourceDir = join(root, "components", "ui");

function sourceFile(path, content) {
  return ts.createSourceFile(path, content, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
}

export function installedExports(dir = sourceDir) {
  const map = new Map();
  for (const file of readdirSync(dir).filter((x) => x.endsWith(".tsx"))) {
    const ast = sourceFile(file, readFileSync(join(dir, file), "utf8"));
    for (const statement of ast.statements) {
      if (ts.isExportDeclaration(statement) && statement.exportClause && ts.isNamedExports(statement.exportClause)) {
        for (const element of statement.exportClause.elements) {
          const symbol = element.name.text;
          if (/^[A-Z]/.test(symbol)) map.set(symbol, file);
        }
      }
      if ((ts.isFunctionDeclaration(statement) || ts.isClassDeclaration(statement) || ts.isInterfaceDeclaration(statement) || ts.isTypeAliasDeclaration(statement)) && statement.name && ts.canHaveModifiers(statement) && ts.getModifiers(statement)?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)) {
        map.set(statement.name.text, file);
      }
    }
  }
  return map;
}

const nativeControls = new Map([
  ["button", "Button"], ["input", "Input"], ["textarea", "Textarea"],
  ["select", "Select"], ["table", "Table"], ["hr", "Separator"],
  ["dialog", "Sheet"], ["progress", "Progress"],
]);
const roles = new Map([
  ["dialog", "Sheet / shadcn Dialog"], ["tab", "TabsTrigger"],
  ["tablist", "TabsList"], ["tabpanel", "TabsContent"],
  ["menu", "DropdownMenu"], ["menuitem", "DropdownMenuItem"],
  ["tooltip", "Tooltip"], ["separator", "Separator"],
]);

export function analyzeTsx(content, path, installed = installedExports()) {
  const ast = sourceFile(path, content);
  const findings = [];
  const localUiImports = new Set();
  for (const statement of ast.statements) {
    if (!ts.isImportDeclaration(statement) || !ts.isStringLiteral(statement.moduleSpecifier)) continue;
    const value = statement.moduleSpecifier.text;
    if (value.startsWith("@/components/ui/") || value.includes("/components/ui/")) {
      const bindings = statement.importClause?.namedBindings;
      if (bindings && ts.isNamedImports(bindings)) for (const item of bindings.elements) localUiImports.add(item.name.text);
    } else if (/^(radix-ui|@radix-ui\/)/.test(value)) {
      findings.push({ severity: "review", line: ast.getLineAndCharacterOfPosition(statement.getStart(ast)).line + 1, message: "Direct Radix import outside components/ui: check if an installed shadcn wrapper already covers the same behavior." });
    }
  }

  function add(severity, node, message) {
    const line = ast.getLineAndCharacterOfPosition(node.getStart(ast)).line + 1;
    findings.push({ severity, line, message });
  }

  const aliasPattern = /^(?:Custom|Styled|Base|Raw|Fancy|Primitive|Reusable)(Button|Input|Textarea|Select|Table|Tabs|Sidebar|Card|Badge|Sheet|Tooltip|Accordion|Separator|Avatar|Label|Toggle)$/;
  function inspectDefinition(node, name) {
    if (!/^[A-Z]/.test(name)) return;
    if (installed.has(name)) {
      add("error", node, "Local component '" + name + "' shadows installed '" + name + "' in components/ui/" + installed.get(name) + ". Import/compose the installed component instead.");
    } else {
      const match = aliasPattern.exec(name);
      if (match && installed.has(match[1]) && !localUiImports.has(match[1])) {
        add("review", node, "'" + name + "' resembles an installed " + match[1] + ". Check components/ui/" + installed.get(match[1]) + " before adding a custom control.");
      }
    }
  }

  function walk(node) {
    if (ts.isFunctionDeclaration(node) && node.name) inspectDefinition(node, node.name.text);
    if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.initializer &&
      (ts.isArrowFunction(node.initializer) || ts.isFunctionExpression(node.initializer))) {
      inspectDefinition(node, node.name.text);
    }
    if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
      const tag = node.tagName.getText(ast);
      if (nativeControls.has(tag)) {
        const preferred = nativeControls.get(tag);
        if (installed.has(preferred)) {
          add("review", node, "Native <" + tag + "> added; check installed " + preferred + " from components/ui/" + installed.get(preferred) + ". ESLint enforces registry-only markup.");
        }
      }
      for (const attribute of node.attributes.properties) {
        if (!ts.isJsxAttribute(attribute) || attribute.name.getText(ast) !== "role" || !attribute.initializer || !ts.isStringLiteral(attribute.initializer)) continue;
        const role = attribute.initializer.text;
        if (roles.has(role)) {
          add("review", attribute, "Manual role='" + role + "'; prefer existing " + roles.get(role) + " unless there is a documented product-specific need.");
        }
      }
    }
    ts.forEachChild(node, walk);
  }
  walk(ast);
  return findings;
}

export function addedLineRanges(diff) {
  const ranges = [];
  for (const line of diff.split(/\r?\n/)) {
    const match = /^@@ -\d+(?:,\d+)? \+(\d+)(?:,(\d+))? @@/.exec(line);
    if (!match) continue;
    const start = Number(match[1]);
    const count = match[2] === undefined ? 1 : Number(match[2]);
    if (count > 0) ranges.push([start, start + count - 1]);
  }
  return ranges;
}

function git(...args) {
  return execFileSync("git", args, { cwd: root, encoding: "utf8" }).trim();
}
function report(findings, checkedFiles) {
  const errors = findings.filter((f) => f.severity === "error");
  const warnings = findings.filter((f) => f.severity === "review");
  for (const item of findings) {
    const kind = item.severity === "error" ? "error" : "warning";
    const msg = item.message.replaceAll("%", "%25").replaceAll("\n", "%0A");
    console.log("::" + kind + " file=" + item.path + ",line=" + item.line + ",title=UI component reuse::" + msg);
  }
  const lines = [
    "## UI reuse guard",
    "",
    "Checked **" + checkedFiles + "** changed TSX files; **" + errors.length + "** blocking name collisions and **" + warnings.length + "** review hints.",
    "",
    "This deterministic check catches exact collisions and some suspicious wrappers/semantic roles. It cannot establish visual or behavioral equivalence. ESLint separately rejects new raw form controls; the reviewer/agent still checks design reuse.",
  ];
  if (findings.length) {
    lines.push("", "| Severity | File | Finding |", "| --- | --- | --- |");
    for (const f of findings) {
      lines.push("| " + f.severity + " | " + f.path + ":" + f.line + " | " + f.message.replaceAll("|", "\\|") + " |");
    }
  }
  if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, lines.join("\n") + "\n");
  console.log(lines.slice(0, 4).join("\n"));
  if (errors.length) process.exitCode = 1;
}

function run() {
  const arg = process.argv.indexOf("--base");
  const base = arg === -1 ? process.env.GITHUB_BASE_SHA : process.argv[arg + 1];
  if (!base) {
    console.error("Usage: npm run ui:reuse:check -- --base <main-sha-or-origin/main>");
    process.exitCode = 2;
    return;
  }
  const paths = git("diff", "--name-only", "--diff-filter=ACMR", base + "...HEAD", "--", "app", "components", "features").split("\n")
    .filter((path) => /\.(tsx|jsx)$/.test(path) && !path.startsWith("components/ui/") && existsSync(join(root, path)));
  const installed = installedExports();
  const findings = [];
  for (const path of paths) {
    const ranges = addedLineRanges(git("diff", "--no-ext-diff", "--unified=0", base + "...HEAD", "--", path));
    if (!ranges.length) continue;
    const candidate = analyzeTsx(readFileSync(join(root, path), "utf8"), path, installed);
    for (const finding of candidate) {
      if (ranges.some(([start, end]) => finding.line >= start && finding.line <= end)) {
        findings.push({ ...finding, path });
      }
    }
  }
  report(findings, paths.length);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { run(); } catch (error) { console.error(error); process.exitCode = 2; }
}
