import { emailBrand } from "../../content/email";

type Recipient = { firstName?: string; actionPath: string };
type Lifecycle = { canReceiveLifecycleEmail: boolean; unsubscribePath: string };

export type EmailMessage = Recipient &
  (
    | { kind: "welcome"; firstAction: string }
    | { kind: "first-result"; resultName: string }
    | ({ kind: "setup-reminder"; firstAction: string } & Lifecycle)
    | ({ kind: "trial-ending"; endsOn: string } & Lifecycle)
    | { kind: "team-invite"; inviterName: string; workspaceName: string }
    | { kind: "password-reset" | "magic-link"; expiresInMinutes: number }
  );

export type EmailCopy = {
  subject: string;
  preview: string;
  heading: string;
  paragraphs: string[];
  action: string;
  signature?: string;
};

function expiry(minutes: number) {
  if (!Number.isSafeInteger(minutes) || minutes < 1)
    throw new Error("Email link expiry must be a positive number of minutes.");
  return `This link expires in ${minutes} ${minutes === 1 ? "minute" : "minutes"}.`;
}

function trialDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value))
    throw new Error("Trial end must be a calendar date in YYYY-MM-DD format.");
  const date = new Date(value);
  if (
    Number.isNaN(date.getTime()) ||
    date.toISOString().slice(0, 10) !== value
  ) {
    throw new Error("Trial end must be a valid calendar date.");
  }
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(date);
}

export function messageCopy(message: EmailMessage): EmailCopy {
  const { name, signature } = emailBrand;
  switch (message.kind) {
    case "welcome":
      return {
        subject: `Welcome to ${name}`,
        preview: "Here’s where to get started in your workspace.",
        heading: `Welcome to ${name}`,
        paragraphs: [
          `Start by doing this in your workspace: ${message.firstAction}.`,
          "If you get stuck, reply to this email and tell us what you were trying to do.",
        ],
        action: "Open your workspace",
        signature,
      };
    case "first-result":
      return {
        subject: `Your first result is ready in ${name}`,
        preview: "Open the finished result in your workspace.",
        heading: "Your result is ready",
        paragraphs: [
          `You can now open ${message.resultName} in your workspace.`,
        ],
        action: "View the result",
      };
    case "setup-reminder":
      return {
        subject: `Need a hand getting started with ${name}?`,
        preview: "Pick up setup where you left off.",
        heading: "Want a hand with setup?",
        paragraphs: [
          `Your first step in ${name} is still open: ${message.firstAction}.`,
          "Reply if you’d like a hand. Tell us where you got stuck and we’ll point you to the next step.",
        ],
        action: "Continue setup",
        signature,
      };
    case "trial-ending": {
      const date = trialDate(message.endsOn);
      return {
        subject: `Your ${name} trial ends on ${date}`,
        preview: "Review the available plans in your workspace.",
        heading: "Your trial is ending soon",
        paragraphs: [
          `Your ${name} trial ends on ${date}. Open billing to review your options before then.`,
        ],
        action: "Review billing",
      };
    }
    case "team-invite":
      return {
        subject: `You’ve been invited to a ${name} workspace`,
        preview: "Open the invitation to see which workspace you’re joining.",
        heading: "Join your team",
        paragraphs: [
          `${message.inviterName} invited you to join ${message.workspaceName} on ${name}.`,
        ],
        action: "Accept invitation",
      };
    case "password-reset":
      return {
        subject: `Reset your ${name} password`,
        preview: "Use this link to choose a new password.",
        heading: "Reset your password",
        paragraphs: [
          `We received a password reset request for your ${name} account. ${expiry(message.expiresInMinutes)}`,
          "If you didn’t request a reset, you can ignore this email.",
        ],
        action: "Reset password",
      };
    case "magic-link":
      return {
        subject: `Your ${name} sign-in link`,
        preview: "Open this link to sign in to your account.",
        heading: `Sign in to ${name}`,
        paragraphs: [
          `Use the button below to sign in. ${expiry(message.expiresInMinutes)}`,
          "If you didn’t request this link, you can ignore this email.",
        ],
        action: "Sign in",
      };
  }
}

export function emailLinks(message: EmailMessage, origin: string) {
  const app = new URL(origin);
  const local = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(app.hostname);
  if (
    (app.protocol !== "https:" && !(local && app.protocol === "http:")) ||
    app.href !== app.origin + "/"
  ) {
    throw new Error(
      "EMAIL_APP_ORIGIN must be an HTTPS origin or a local HTTP origin for development.",
    );
  }

  function link(path: string) {
    const url = new URL(path, app);
    if (
      !path.startsWith("/") ||
      path.startsWith("//") ||
      url.origin !== app.origin
    ) {
      throw new Error(
        "Email links must be paths on the configured app origin.",
      );
    }
    return url.href;
  }

  return {
    actionUrl: link(message.actionPath),
    unsubscribeUrl:
      "unsubscribePath" in message ? link(message.unsubscribePath) : undefined,
  };
}
