import { runAgent, type AgentTurn } from "@/lib/feedback/agent";
import { feedbackLimits } from "@/lib/feedback/config";
import { resolveIdentity } from "@/lib/feedback/identity";
import { capture } from "@/lib/feedback/posthog";
import { recentTopics, saveRows } from "@/lib/feedback/store";

export const dynamic = "force-dynamic";

const sessionPattern = /^[a-zA-Z0-9-]{8,64}$/;

export async function POST(request: Request) {
  let body: { sessionId?: unknown; pageUrl?: unknown; messages?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const sessionId = typeof body.sessionId === "string" && sessionPattern.test(body.sessionId) ? body.sessionId : null;
  const pageUrl = typeof body.pageUrl === "string" ? body.pageUrl.slice(0, 500) : null;
  const messages: AgentTurn[] = Array.isArray(body.messages)
    ? body.messages
        .filter((m): m is AgentTurn => !!m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
        .map((m) => ({ role: m.role, content: m.content.slice(0, feedbackLimits.maxInput) }))
    : [];
  const last = messages.at(-1);
  if (!sessionId || !last || last.role !== "user" || !last.content.trim()) {
    return Response.json({ error: "Bad request" }, { status: 400 });
  }

  const identity = await resolveIdentity(request);
  const result = await runAgent(messages, await recentTopics());
  const context = { page_url: pageUrl, user_id: identity.userId, user_email: identity.userEmail, workspace_id: identity.workspaceId, session_id: sessionId };

  await saveRows([
    { ...context, role: "user", message: last.content, kind: result.kind, topic: result.topic, sentiment: result.sentiment, summary: result.summary },
    { ...context, role: "assistant", message: result.reply },
  ]);

  const distinctId = identity.userId ?? `anon-${sessionId}`;
  const props = { $current_url: pageUrl, session_id: sessionId, workspace_id: identity.workspaceId, kind: result.kind, topic: result.topic, sentiment: result.sentiment };
  await capture("feedback_message", distinctId, { ...props, message_length: last.content.length });
  if (result.summary) await capture("feedback_summary", distinctId, { ...props, summary: result.summary });

  return Response.json({ reply: result.reply });
}
