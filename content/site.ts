export const site = {
  name: "Folio",
  title: "Folio | Relationships and outbound, together",
  description:
    "An open-source CRM demo with people, companies, deal pipelines, outbound sequences, and a shared inbox.",
  audience: "B2B",
  theme: "tool" as "tool" | "editorial" | "technical",
  primaryAction: { label: "Explore campaigns", href: "/crm/campaigns" },
  hero: {
    headline: "Your next conversation starts here.",
    description:
      "Keep your people, pipeline, and outreach in one thoughtful workspace. Built for teams that grow through relationships.",
  },
  workflow: [
    {
      title: "Know who you’re talking to",
      description:
        "Explore contacts and companies with a shared view of every relationship.",
    },
    {
      title: "Make your outreach personal",
      description:
        "Plan a sequence, write each follow-up, and keep the conversation in context.",
    },
    {
      title: "Keep the conversation moving",
      description:
        "Review replies, save a draft, and move opportunities through your pipeline.",
    },
  ],
  faq: [
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
