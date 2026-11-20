import type { ChangelogEntry } from "@/lib/changelog";

// Public changelog for /changelog. Rules: docs/CHANGELOG-POSTS.md.
// Replace these sample Folidock entries with your product's. One entry per new feature or clear
// improvement; small fixes go into the "fixes" list of the next entry. Newest first.

export const changelogConfig = {
  name: "Folidock",
  siteUrl: "https://folio-crm-demo.vercel.app",
  description: "New features, improvements and fixes in Folidock, newest first. Each entry has its own page.",
  follow: { label: "Follow on GitHub", href: "https://github.com/matt-warchol/b2b-boilerplate" },
};

export const changelogTags = ["CRM", "Feedback", "Email", "Design", "Legal"] as const;

type Tag = (typeof changelogTags)[number];

export const changelog: (ChangelogEntry & { tags: Tag[] })[] = [
  {
    slug: "more-themes-and-menu",
    date: "2026-11-23",
    title: "Two more looks and a clearer top menu",
    tags: ["Design"],
    summary: "Two new themes, Zinc + Green and Folio, and a top menu that groups the site under Product and Resources.",
    body: [
      "Pick **Zinc + Green** (neutral grey with one muted green accent) or **Folio** (indigo on cool grey) next to **Zinc**, **Editorial** and **Technical**. One setting changes the site, CRM and workspace.",
      "The top menu of the website now has **Product** and **Resources**. Each opens a panel with short cards, so visitors find every part of the product in one place.",
    ],
  },
  {
    slug: "feedback-loop",
    date: "2026-11-20",
    title: "Hear back when your idea ships",
    tags: ["Feedback"],
    summary: "When we build something you asked for in the feedback assistant, you get an email that says how it works now.",
    body: [
      "Ideas and problems you share in the **Feedback** assistant now become tasks for the team. When one ships, everyone who asked for it gets a short email: what you asked for, how it works now, and a link to try it.",
      "Reply to that email or tell the assistant what you think. We read every reply.",
    ],
  },
  {
    slug: "feedback-assistant",
    date: "2026-11-17",
    title: "Ask the feedback assistant",
    tags: ["Feedback"],
    summary: "A chat assistant inside the product answers questions and collects ideas together with the page they came from.",
    body: [
      "Click **Feedback** in the bottom-right corner of the workspace to ask a question about the product or share an idea. The assistant knows the product, links to the right screen, and saves every idea together with the page it came from.",
      "Owners see all feedback in **Admin → Feedback**, grouped by user, with a daily digest and a prompt to analyse it with Claude.",
    ],
    improvements: [
      "Replies are no longer cut off mid-sentence.",
      "Daily limits and a cost cap keep the assistant cheap to run.",
      "The chat works on a phone and closes with Escape.",
    ],
  },
  {
    slug: "privacy-and-cookies",
    date: "2026-11-17",
    title: "Cookie consent, privacy policy and terms",
    tags: ["Legal"],
    summary: "A cookie banner, opt-in analytics and template privacy and terms pages linked from the footer.",
    body: [
      "Visitors now choose whether to allow analytics in a cookie banner. Analytics stay off until they say yes, and **Cookie settings** in the footer lets them change their mind.",
      "Template **Privacy** and **Terms** pages with GDPR and cookie sections are linked from the footer, ready to adapt to your company.",
    ],
  },
  {
    slug: "product-emails",
    date: "2026-11-17",
    title: "Product emails in one style",
    tags: ["Email"],
    summary: "Seven reusable email templates with one shared layout, sent through Resend.",
    image: { src: "/marketing-inbox.webp", alt: "Shared inbox with replies to outbound emails", width: 860, height: 540 },
    body: [
      "Sign-in links, invites, reports and digests now share one layout, so every email looks like the product. Seven templates cover the common cases, and you can preview each one before it goes out.",
      "Delivery runs through Resend and stays off until the owner turns it on.",
    ],
  },
  {
    slug: "visual-presets-and-pipeline",
    date: "2026-11-16",
    title: "Three looks and a draggable pipeline",
    tags: ["Design", "CRM"],
    summary: "Pick one of three visual presets and move deals between stages by dragging them.",
    image: { src: "/marketing-pipeline.webp", alt: "Sales pipeline with deals in stages", width: 860, height: 540 },
    body: [
      "Choose one of three visual presets for the site, CRM and workspace: **Zinc** (the default grey), **Editorial** or **Technical**. One setting changes them all.",
      "In **Pipeline**, drag a deal to the next stage. Totals per stage update as you move it.",
    ],
    improvements: [
      "Every select, button and table now comes from shadcn/ui, so all screens behave the same.",
      "Landing screenshots are recaptured automatically when the UI changes.",
    ],
  },
  {
    slug: "folidock-crm-demo",
    date: "2026-11-16",
    title: "Folidock: a CRM demo you can click through",
    tags: ["CRM"],
    summary: "A working CRM demo with outbound campaigns, a shared inbox, ten workspace views and an owner console.",
    image: { src: "/crm-preview.webp", alt: "Folidock CRM overview with charts and recent activity", width: 1512, height: 1100 },
    body: [
      "Folidock is live: a sample B2B product with a landing page, a CRM with outbound campaigns and a shared inbox, ten workspace views and an [owner demo](/admin) for customer accounts.",
      "All data is fictional and stays in your browser, so you can try everything without signing up.",
    ],
  },
];
