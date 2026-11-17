import { site } from "./site";

// Privacy policy and terms of service: a plain-language TEMPLATE for B2B SaaS products built on this starter.
// Before launch: set operator, contact, providers, retention and law; delete what you don't use (e.g. Google, Notion); ask a lawyer to review.
// Google requires the "Google user data" section (Limited Use) when you use Google APIs with user data.

export type LegalDoc = {
  title: string;
  updated: string;
  intro: string;
  sections: { heading: string; body: string[]; list?: string[] }[];
};

const product = site.name;
const operator = `${site.name} (replace with your company name, address and registration number)`;
const contact = "privacy@example.com";
const updated = "17 November 2026";

export const privacy: LegalDoc = {
  title: "Privacy policy",
  updated,
  intro: `This policy explains what personal data ${product} collects, why, who processes it for us, and how you can control it.`,
  sections: [
    {
      heading: "Who we are",
      body: [`${operator} is the data controller. Questions or requests: ${contact}.`],
    },
    {
      heading: "What we collect",
      body: [],
      list: [
        "Early-access form: your work email and company website.",
        "Account: the email you sign in with, when you were invited and last signed in.",
        "Workspace content: answers, notes, pipeline items and files you or your team add, and the data your company stores in the product.",
        "Connected sources: only the files you pick in Google Drive and the Notion pages you share with us (read only).",
        "Usage data: pages viewed and clicks in the product, browser and device type, via PostHog (EU cloud), with cookies.",
        "Feedback you send through the feedback button, with the page it was sent from.",
      ],
    },
    {
      heading: "Why we use it",
      body: [],
      list: [
        "To run the service you signed up for: sign-in links, your workspace, your leads and plans (contract).",
        "To send the email notifications you chose in Settings (contract; you can switch them off).",
        "To improve the product and fix problems, using usage data and feedback (legitimate interest).",
        "To reply to your early-access request (your request; legitimate interest).",
      ],
    },
    {
      heading: "Google user data",
      body: [
        `If you connect Google Drive, ${product} uses the Google Picker with the drive.file scope: we can open only the files you select, never the rest of your Drive. We copy the selected files into your workspace so your team can use them in the product.`,
        `${product}'s use and transfer of information received from Google APIs adheres to the Google API Services User Data Policy, including the Limited Use requirements. We do not use Google user data for advertising, do not sell it, and do not use it to train general AI models.`,
      ],
    },
    {
      heading: "Who processes data for us",
      body: ["We use these providers, each under a data processing agreement:"],
      list: [
        "Supabase: database, sign-in and file storage (EU, Frankfurt).",
        "Vercel: website hosting.",
        "Resend: sending emails.",
        "PostHog: product analytics (EU).",
        "Your AI provider (for example Anthropic): AI features. Your data is not used to train their models.",
        "Google and Notion: only when you connect them.",
      ],
    },
    {
      heading: "Transfers outside the EEA",
      body: [
        "Some providers may process data in the United States. Where they do, transfers rely on the EU-US Data Privacy Framework or the European Commission's standard contractual clauses.",
      ],
    },
    {
      heading: "How long we keep it",
      body: [
        `Workspace data is kept while your company uses ${product} and deleted within 30 days after the workspace is closed. Early-access requests are kept for up to 12 months. Usage analytics are kept for up to 12 months.`,
      ],
    },
    {
      heading: "Your rights",
      body: [
        `You can ask for access to your data, a copy of it, correction, deletion, restriction or objection, and you can withdraw consent at any time. Write to ${contact}. You can also complain to your data protection authority (in Poland: the President of the Personal Data Protection Office, UODO).`,
      ],
    },
    {
      heading: "Security",
      body: [
        "Data is encrypted in transit and at rest. Each company sees only its own workspace (row-level security). Sign-in uses one-time email links, so there are no passwords to leak. Connections to other tools are read only.",
      ],
    },
    {
      heading: "Changes",
      body: ["We will update this page and the date above when this policy changes, and email you about important changes."],
    },
  ],
};

export const terms: LegalDoc = {
  title: "Terms of service",
  updated,
  intro: `These terms apply to your use of ${product} during the pilot. By signing in you accept them on behalf of your company.`,
  sections: [
    {
      heading: "The service",
      body: [
        `${product} is a B2B software service. During the pilot the service may be free and may change as we learn from you.`,
      ],
    },
    {
      heading: "Accounts",
      body: [
        "Your company admin invites people by email. Keep sign-in links to yourself, and tell us if someone should lose access. You are responsible for what is done in your company's workspace.",
      ],
    },
    {
      heading: "Your content",
      body: [
        "You keep all rights to the files, answers and data you add. You give us permission to store and process them only to run the service for you. You confirm you may share them with us.",
      ],
    },
    {
      heading: "Insights and advice",
      body: [
        `Insights and suggestions are prepared carefully but can be incomplete or out of date. Check important facts before you act. ${product} does not give legal, tax or financial advice.`,
      ],
    },
    {
      heading: "Acceptable use",
      body: [],
      list: [
        "Do not try to access other companies' workspaces or break the service.",
        "Do not upload content you have no right to share, or malware.",
        "Do not resell or republish the service without our agreement.",
      ],
    },
    {
      heading: "Availability and changes",
      body: [
        `We aim to keep ${product} available but do not guarantee uninterrupted service during the pilot. We may change or end the pilot with reasonable notice by email, and you can export your data before it ends.`,
      ],
    },
    {
      heading: "Liability",
      body: [
        "The pilot is provided as is. To the extent the law allows, we are not liable for indirect losses, such as lost bids, revenue or profit. Nothing in these terms limits liability that cannot be limited by law.",
      ],
    },
    {
      heading: "Ending use",
      body: [
        `You can stop using ${product} at any time and ask us to delete your workspace at ${contact}. We may suspend access that breaks these terms.`,
      ],
    },
    {
      heading: "Law",
      body: ["These terms are governed by Polish law. Courts in Poland have jurisdiction, unless mandatory consumer law says otherwise."],
    },
    {
      heading: "Contact",
      body: [`${operator}, ${contact}.`],
    },
  ],
};
