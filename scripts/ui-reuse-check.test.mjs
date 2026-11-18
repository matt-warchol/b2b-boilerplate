import test from "node:test";
import assert from "node:assert/strict";
import { analyzeTsx, addedLineRanges } from "./ui-reuse-check.mjs";

const installed = new Map([
  ["Button", "button.tsx"], ["Table", "table.tsx"],
  ["TabsList", "tabs.tsx"], ["Card", "card.tsx"],
]);
test("blocks redeclaration of an installed primitive", () => {
  const findings = analyzeTsx('export function Button() { return <div /> }', "components/example.tsx", installed);
  assert.equal(findings.some((f) => f.severity === "error" && f.message.includes("button.tsx")), true);
});
test("does not flag normal composition of an installed primitive", () => {
  const code = 'import { Button } from "@/components/ui/button"; function CampaignButton() { return <Button>Go</Button> }';
  assert.deepEqual(analyzeTsx(code, "components/campaign.tsx", installed), []);
});
test("asks for review of duplicate-style aliases but allows reuse wrappers", () => {
  const custom = 'function CustomButton() { return <div>Go</div> }';
  assert.equal(analyzeTsx(custom, "components/custom.tsx", installed).some((f) => f.severity === "review"), true);
  const wrapping = 'import { Button } from "@/components/ui/button"; function CustomButton() { return <Button>Go</Button> }';
  assert.deepEqual(analyzeTsx(wrapping, "components/custom.tsx", installed), []);
});
test("flags hand-built semantic tablists as review, not automatic failure", () => {
  const findings = analyzeTsx('function Picker() { return <div role="tablist">x</div> }', "components/picker.tsx", installed);
  assert.equal(findings.some((f) => f.severity === "review" && f.message.includes("TabsList")), true);
  assert.equal(findings.some((f) => f.severity === "error"), false);
});
test("filters to actual newly added lines and ignores zero-line hunks", () => {
  assert.deepEqual(addedLineRanges("@@ -10,2 +10,3 @@\n+new\n@@ -20 +21,0 @@\n-old\n"), [[10, 12]]);
});
