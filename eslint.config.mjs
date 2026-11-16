import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTypescript,
  globalIgnores([".next/**", "out/**", "next-env.d.ts"]),
  {
    // Registry-only UI: product code composes shadcn/ui components from components/ui.
    // A raw element is allowed only with a reasoned eslint-disable comment and an entry in docs/UI-AUDIT.md.
    files: ["app/**/*.tsx", "features/**/*.tsx", "components/**/*.tsx"],
    ignores: ["components/ui/**"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector:
            "JSXOpeningElement[name.name=/^(button|input|select|textarea|table|thead|tbody|tfoot|tr|th|td|hr|dialog|progress|meter)$/]",
          message:
            "Use the shadcn/ui component from components/ui (Button, Input, Select, Textarea, Table, Separator, Dialog/Sheet, Progress). If the registry has no equivalent, add an eslint-disable comment with the reason and list the exception in docs/UI-AUDIT.md.",
        },
      ],
    },
  },
]);
