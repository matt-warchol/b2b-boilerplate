export const site = {
  name: "Folio",
  title: "Folio | Relationships and outbound, together",
  description:
    "An open-source B2B starter with a CRM, outbound sequences, a shared inbox, and a SaaS owner dashboard.",
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
      question: "Can I adapt Folio for my own product?",
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
