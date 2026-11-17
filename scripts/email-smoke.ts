import { randomUUID } from "node:crypto";
import { existsSync } from "node:fs";
import { deliverProductEmail } from "../features/email/delivery";
import { previewOrigin, previews } from "../features/email/preview-data";

async function main() {
  if (existsSync(".env.local")) process.loadEnvFile(".env.local");
  const result = await deliverProductEmail(
    {
      eventId: `smoke-${randomUUID()}`,
      to: "delivered@resend.dev",
      message: previews.welcome,
    },
    {
      EMAIL_MODE: "live",
      RESEND_API_KEY: process.env.RESEND_API_KEY,
      EMAIL_APP_ORIGIN: previewOrigin,
      EMAIL_FROM: process.env.EMAIL_FROM || "Folidock <onboarding@resend.dev>",
    },
  );
  if (result.status !== "accepted")
    throw new Error(result.status === "failed" ? result.code : result.status);
  console.log(
    `Resend accepted the simulated email. Message ID: ${result.providerId}`,
  );
}

main().catch((error: unknown) => {
  console.error(
    error instanceof Error ? error.message : "Email smoke test failed.",
  );
  process.exitCode = 1;
});
