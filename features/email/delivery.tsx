import { createHash } from "node:crypto";
import { render, toPlainText } from "react-email";
import { Resend } from "resend";
import { ProductEmail } from "./email-template";
import { emailLinks, messageCopy, type EmailMessage } from "./messages";

type Delivery = { eventId: string; to: string; message: EmailMessage };
type Environment = Readonly<Record<string, string | undefined>>;

export type EmailResult =
  | { status: "skipped"; reason: "lifecycle-preference" }
  | { status: "dry-run"; idempotencyKey: string }
  | { status: "accepted"; idempotencyKey: string; providerId: string }
  | {
      status: "failed";
      idempotencyKey: string;
      code: string;
      retryable: boolean;
      retryAfterSeconds?: number;
    };

const mailbox =
  /^[^\s<>@,;:\u0000-\u001f\u007f]+@[^\s<>@,;:\u0000-\u001f\u007f]+\.[^\s<>@,;:\u0000-\u001f\u007f]+$/;
const sender = /^([^<>\r\n]+) <([^<>\r\n]+)>$/;

function fromAddress(value: string) {
  return sender.exec(value)?.[2] ?? value;
}

export async function renderProductEmail(
  message: EmailMessage,
  origin: string,
) {
  const { subject } = messageCopy(message);
  const html = await render(<ProductEmail message={message} origin={origin} />);
  return { subject, html, text: toPlainText(html) };
}

export async function deliverProductEmail(
  { eventId, to, message }: Delivery,
  env: Environment,
): Promise<EmailResult> {
  const mode = env.EMAIL_MODE || "dry-run";
  if (mode !== "dry-run" && mode !== "live")
    throw new Error("EMAIL_MODE must be dry-run or live.");
  if (
    "canReceiveLifecycleEmail" in message &&
    message.canReceiveLifecycleEmail !== true
  ) {
    return { status: "skipped", reason: "lifecycle-preference" };
  }

  const recipient = to.trim();
  if (!eventId.trim() || !mailbox.test(recipient))
    throw new Error(
      "Email delivery requires an event ID and one recipient mailbox.",
    );
  const hash = createHash("sha256")
    .update(JSON.stringify([message.kind, eventId, recipient.toLowerCase()]))
    .digest("hex");
  const idempotencyKey = `${message.kind}/${hash}`;
  const origin =
    env.EMAIL_APP_ORIGIN?.trim() ||
    (mode === "dry-run" ? "http://localhost:3000" : "");
  if (!origin)
    throw new Error("Set EMAIL_APP_ORIGIN before enabling live email.");
  emailLinks(message, origin);
  if (mode === "dry-run") return { status: "dry-run", idempotencyKey };
  if (new URL(origin).protocol !== "https:")
    throw new Error("Live email requires an HTTPS app origin.");

  const key = env.RESEND_API_KEY?.trim();
  const from = env.EMAIL_FROM?.trim();
  const replyTo = env.EMAIL_REPLY_TO?.trim() || undefined;
  if (!key || !from || !mailbox.test(fromAddress(from)))
    throw new Error(
      "Live email requires RESEND_API_KEY and a valid EMAIL_FROM sender.",
    );
  if (replyTo && !mailbox.test(replyTo))
    throw new Error("EMAIL_REPLY_TO must be one mailbox.");

  const rendered = await renderProductEmail(message, origin);
  const resend = new Resend(key);
  const { data, error, headers } = await resend.emails.send(
    {
      ...rendered,
      from,
      to: recipient,
      replyTo,
      tags: [{ name: "template", value: message.kind }],
    },
    { idempotencyKey, signal: AbortSignal.timeout(10_000) },
  );

  if (data) return { status: "accepted", idempotencyKey, providerId: data.id };
  const retryAfter = Number(headers?.["retry-after"]);
  return {
    status: "failed",
    idempotencyKey,
    code: error.name,
    retryable:
      error.statusCode === null ||
      (error.statusCode >= 500 && error.statusCode < 600) ||
      error.name === "rate_limit_exceeded" ||
      error.name === "concurrent_idempotent_requests",
    ...(Number.isFinite(retryAfter) && retryAfter > 0
      ? { retryAfterSeconds: retryAfter }
      : {}),
  };
}
