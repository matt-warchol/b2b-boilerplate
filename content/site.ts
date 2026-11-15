export const site = {
  name: "DealRadar",
  title: "DealRadar | Pick the tenders worth pursuing",
  description: "A workspace demo for bid teams to shortlist public tenders, track deadlines and take the next step with a bid brief.",
  audience: "B2B",
  theme: "tool" as "tool" | "editorial" | "technical",
  primaryAction: { label: "Open the demo", href: "/workspace" },
  hero: {
    headline: "Pick the tenders worth pursuing.",
    description: "Shortlist public tenders and turn each decision into a brief for your bid team.",
  },
  workflow: [
    { title: "Start with the shortlist", description: "Set a stage and filter to the tenders worth discussing." },
    { title: "Write down the next move", description: "Keep the deadline and your next action with the original decision." },
    { title: "Draft a brief for the bid review", description: "Generate an editable draft from the record and download it to share." },
  ],
  faq: [
    { question: "Who is this for?", answer: "This demo is for software and IT services teams that review public tenders and need to agree on which ones to pursue." },
    { question: "Does the workspace pull live tenders?", answer: "This demo uses fictional tenders. You can add your own sample records; there is no live feed connected." },
    { question: "Where are changes saved?", answer: "The demo saves changes in this browser when local storage is available. Use sample information and download any briefs you want to keep." },
  ],
} as const;
