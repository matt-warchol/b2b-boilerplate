export const site = {
  name: "Folidock",
  title: "Folidock | Open-source B2B SaaS starter",
  description:
    "Build your B2B SaaS from a landing page, CRM with outbound sequences and shared inbox, and an owner console for customer accounts.",
  audience: "B2B",
  theme: "tool" as "tool" | "editorial" | "technical",
  primaryAction: { label: "Explore campaigns", href: "/crm/campaigns" },
  faq: [
    {
      question: "What can the SaaS owner demo do?",
      answer:
        "You can add and edit sample customer accounts, filter by status, and review seats and simulated recurring revenue. The owner demo is public and uses browser storage.",
    },
    {
      question: "Can I adapt Folidock for my own product?",
      answer:
        "Yes. The source is available as an MIT-licensed GitHub template. Replace the sample data and add your own authentication and integrations before using it with real customers.",
    },
    {
      question: "Who is this for?",
      answer:
        "For founders and B2B teams who want to manage relationships and outbound together.",
    },
    {
      question: "Does the demo send emails?",
      answer:
        "Campaigns use fictional contacts and simulated sending. Create drafts and edit sequences to explore the workflow.",
    },
    {
      question: "Where are changes saved?",
      answer:
        "The demo saves changes in this browser when local storage is available. Campaign edits, pipeline changes, and reply drafts stay on this device.",
    },
  ],
} as const;
