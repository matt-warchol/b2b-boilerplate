
export async function capture(event: "feedback_message" | "feedback_summary", distinctId: string, properties: Record<string, unknown>) {
  const key = process.env.POSTHOG_KEY;
  if (!key) return;
  const host = (process.env.POSTHOG_HOST ?? "https://eu.i.posthog.com").replace(/\/$/, "");
  try {
    await fetch(`${host}/capture/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ api_key: key, event, distinct_id: distinctId, properties, timestamp: new Date().toISOString() }),
    });
  } catch (error) {
    console.error("posthog capture failed", error);
  }
}
