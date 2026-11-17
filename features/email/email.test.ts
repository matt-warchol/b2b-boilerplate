import assert from "node:assert/strict";
import { test } from "node:test";
import { deliverProductEmail, renderProductEmail } from "./delivery";
import { messageCopy } from "./messages";
import { previewOrigin, previews } from "./preview-data";

const delivery = {
  eventId: "signup/47",
  to: "morgan@example.com",
  message: previews.welcome,
};
const live = {
  EMAIL_MODE: "live",
  EMAIL_FROM: "Folidock <hello@notify.example.com>",
  EMAIL_REPLY_TO: "support@example.com",
  EMAIL_APP_ORIGIN: previewOrigin,
  RESEND_API_KEY: "re_mock",
};

test("all seven messages render HTML and plain text with a working standalone preview link", async () => {
  assert.equal(Object.keys(previews).length, 7);
  for (const message of Object.values(previews)) {
    const { subject, html, text } = await renderProductEmail(
      message,
      previewOrigin,
    );
    assert.equal(subject, messageCopy(message).subject);
    assert.ok(html.includes("<!DOCTYPE html"), message.kind);
    assert.ok(html.includes(previewOrigin + message.actionPath), message.kind);
    assert.ok(text.includes(previewOrigin + message.actionPath), message.kind);
    assert.equal(
      text.includes("/settings/email"),
      "unsubscribePath" in message,
      message.kind,
    );
  }
});

test("dry run stays offline even with a key, and ineligible lifecycle email is skipped", async ({
  mock,
}) => {
  const fetch = mock.method(globalThis, "fetch", () => {
    throw new Error("Unexpected network call");
  });
  const first = await deliverProductEmail(delivery, {
    RESEND_API_KEY: "re_mock",
  });
  assert.equal(first.status, "dry-run");
  assert.deepEqual(await deliverProductEmail(delivery, {}), first);
  assert.notDeepEqual(
    await deliverProductEmail({ ...delivery, eventId: "signup/48" }, {}),
    first,
  );
  const message = {
    ...previews["setup-reminder"],
    canReceiveLifecycleEmail: false,
  };
  assert.deepEqual(await deliverProductEmail({ ...delivery, message }, live), {
    status: "skipped",
    reason: "lifecycle-preference",
  });
  assert.equal(fetch.mock.callCount(), 0);
});

test("misconfiguration and off-origin links fail before contacting the provider", async ({
  mock,
}) => {
  const fetch = mock.method(globalThis, "fetch", () => {
    throw new Error("Unexpected network call");
  });
  await assert.rejects(
    deliverProductEmail(delivery, { ...live, EMAIL_MODE: "yes" }),
    /EMAIL_MODE/,
  );
  await assert.rejects(
    deliverProductEmail(delivery, { ...live, RESEND_API_KEY: "" }),
    /RESEND_API_KEY/,
  );
  const message = {
    ...previews["magic-link"],
    actionPath: "https://other.example/signin",
  };
  await assert.rejects(
    deliverProductEmail({ ...delivery, message }, live),
    /on the configured app origin/,
  );
  await assert.rejects(
    deliverProductEmail(delivery, {
      ...live,
      EMAIL_APP_ORIGIN: "http://localhost:3000",
    }),
    /HTTPS/,
  );
  assert.equal(fetch.mock.callCount(), 0);
});

test("Resend uses a stable provider key and sends both formats; rejected payloads are permanent", async ({
  mock,
}) => {
  const calls: { id: string | null; body: Record<string, unknown> }[] = [];
  mock.method(
    globalThis,
    "fetch",
    async (_url: unknown, options: RequestInit) => {
      calls.push({
        id: new Headers(options.headers).get("idempotency-key"),
        body: JSON.parse(String(options.body)),
      });
      if (calls.length === 2)
        return Response.json(
          { name: "rate_limit_exceeded", message: "Slow down" },
          { status: 429, headers: { "retry-after": "30" } },
        );
      if (calls.length === 3)
        return Response.json(
          { name: "validation_error", message: "Rejected" },
          { status: 422 },
        );
      return Response.json({ id: "example-message-id" });
    },
  );
  const first = await deliverProductEmail(delivery, live);
  const second = await deliverProductEmail(delivery, live);
  const third = await deliverProductEmail(delivery, live);
  assert.equal(first.status, "accepted");
  assert.deepEqual(second, {
    status: "failed",
    idempotencyKey: calls[0].id,
    code: "rate_limit_exceeded",
    retryable: true,
    retryAfterSeconds: 30,
  });
  assert.equal(third.status === "failed" && third.retryable, false);
  assert.ok(calls[0].id?.startsWith("welcome/"));
  assert.deepEqual(calls[0], calls[1]);
  assert.equal(calls[0].body.reply_to, "support@example.com");
  assert.ok(calls[0].body.html);
  assert.ok(calls[0].body.text);
});
