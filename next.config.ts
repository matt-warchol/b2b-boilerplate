import type { NextConfig } from "next";

const config: NextConfig = {
  devIndicators: false,
  // The Feedback agent reads its knowledge files at runtime.
  outputFileTracingIncludes: { "/api/feedback/chat": ["./content/product-context.md", "./content/faq.md", "./content/playbook.md", "./content/product-map.generated.md"] },
};

export default config;
