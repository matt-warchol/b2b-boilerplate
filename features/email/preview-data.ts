import type { EmailMessage } from "./messages";

export const previewOrigin = "https://example.com";
const lifecycle = {
  canReceiveLifecycleEmail: true,
  unsubscribePath: "/settings/email",
};

export const previews = {
  welcome: {
    kind: "welcome",
    firstName: "Morgan",
    firstAction: "add your first contact",
    actionPath: "/crm/people",
  },
  "first-result": {
    kind: "first-result",
    firstName: "Morgan",
    resultName: "your first campaign draft",
    actionPath: "/crm/campaigns/example",
  },
  "setup-reminder": {
    kind: "setup-reminder",
    firstName: "Morgan",
    firstAction: "add your first contact",
    actionPath: "/crm/people",
    ...lifecycle,
  },
  "trial-ending": {
    kind: "trial-ending",
    firstName: "Morgan",
    endsOn: "2027-01-15",
    actionPath: "/settings/billing",
    ...lifecycle,
  },
  "team-invite": {
    kind: "team-invite",
    inviterName: "Alex Morgan",
    workspaceName: "Acme Studio",
    actionPath: "/join?token=preview-only",
  },
  "password-reset": {
    kind: "password-reset",
    expiresInMinutes: 30,
    actionPath: "/auth/reset?token=preview-only",
  },
  "magic-link": {
    kind: "magic-link",
    expiresInMinutes: 15,
    actionPath: "/auth/confirm?token=preview-only",
  },
  "feedback-shipped": {
    kind: "feedback-shipped",
    firstName: "Morgan",
    request: "a way to export contacts to CSV",
    howItWorks: "Open People, filter the list, then click Export. You get a CSV with the columns you see.",
    actionPath: "/crm/people",
  },
} satisfies Record<EmailMessage["kind"], EmailMessage>;
