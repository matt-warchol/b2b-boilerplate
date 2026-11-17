import { sameSecret } from "@/lib/feedback/admin-auth";
import { groupByTopic, listSince } from "@/lib/feedback/store";

export const dynamic = "force-dynamic";

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || secret.length < 24 || !sameSecret(request.headers.get("authorization") ?? "", `Bearer ${secret}`)) {
    return new Response("Unauthorized", { status: 401 });
  }
  const key = process.env.RESEND_API_KEY;
  const from = process.env.FEEDBACK_DIGEST_FROM;
  const to = process.env.FEEDBACK_DIGEST_TO;
  if (!key || !from || !to) return Response.json({ sent: false, reason: "Resend not configured" });

  const rows = await listSince(new Date(Date.now() - 86_400_000).toISOString());
  const groups = groupByTopic(rows);
  if (!groups.length) return Response.json({ sent: false, reason: "No feedback in the last 24 hours" });

  const total = groups.reduce((n, g) => n + g.items.length, 0);
  const text = groups
    .map((g) => `${g.topic}: ${g.items.length} message(s), ${g.negative} negative, ${g.sessions} conversation(s)\n` +
      g.items.slice(0, 3).map((i) => `  - ${i.summary ?? i.message.slice(0, 140)} (${i.page_url ?? "no page"})`).join("\n"))
    .join("\n\n");
  const html = groups
    .map((g) => `<h3>${esc(g.topic)} <small>(${g.items.length} messages, ${g.negative} negative)</small></h3><ul>` +
      g.items.slice(0, 3).map((i) => `<li>${esc(i.summary ?? i.message.slice(0, 140))} <small>${esc(i.page_url ?? "")}</small></li>`).join("") + "</ul>")
    .join("");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json", "Idempotency-Key": `feedback-digest-${new Date().toISOString().slice(0, 10)}` },
    body: JSON.stringify({ from, to: to.split(",").map((s) => s.trim()), subject: `Feedback digest: ${total} messages, ${groups.length} topics`, html, text }),
  });
  if (!res.ok) console.error("digest send failed", res.status, await res.text());
  return Response.json({ sent: res.ok, topics: groups.length, messages: total });
}
