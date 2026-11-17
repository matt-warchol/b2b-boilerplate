import { runAgent, type AgentTurn } from "@/lib/feedback/agent";
import { budget, costUsd, feedbackLimits as limits, supabaseConfig } from "@/lib/feedback/config";
import { ipHash, sameOrigin } from "@/lib/feedback/guard";
import { resolveIdentity } from "@/lib/feedback/identity";
import { capture } from "@/lib/feedback/posthog";
import { countWhere, recentTopics, saveRows, spentSince } from "@/lib/feedback/store";

export const dynamic = "force-dynamic";

const sessionPattern = /^[a-zA-Z0-9-]{8,64}$/;
const fail = (error: string, status: number) => Response.json({ error }, { status });

export async function POST(request: Request) {
  // 0. Same-site browser calls with a JSON body only.
  if (!sameOrigin(request) || !request.headers.get("content-type")?.includes("application/json")) return fail("Forbidden.", 403);
  // 1. Only signed-in product users.
  const identity = await resolveIdentity(request);
  if (!identity) return fail("Sign in to use the feedback agent.", 401);
  // 2. Fail closed: without storage the spend cap cannot be enforced.
  if (!supabaseConfig()) return fail("Feedback is not available right now.", 503);

  // 3. Size and shape of the request.
  const raw = await request.text();
  if (raw.length > limits.maxBodyBytes) return fail("Message too long.", 413);
  let body: { sessionId?: unknown; pageUrl?: unknown; messages?: unknown };
  try {
    body = JSON.parse(raw);
  } catch {
    return fail("Invalid request.", 400);
  }
  const sessionId = typeof body.sessionId === "string" && sessionPattern.test(body.sessionId) ? body.sessionId : null;
  const pageUrl = typeof body.pageUrl === "string" ? body.pageUrl.slice(0, 500) : null;
  const messages: AgentTurn[] = Array.isArray(body.messages)
    ? body.messages
        .filter((m): m is AgentTurn => !!m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
        .map((m) => ({ role: m.role, content: m.content.slice(0, limits.maxInput) }))
    : [];
  const last = messages.at(-1);
  if (!sessionId || !last || last.role !== "user" || !last.content.trim()) return fail("Invalid request.", 400);

  // 4. Rate limits per user, session and workspace, then the daily cost cap.
  const enc = encodeURIComponent;
  const hourAgo = new Date(Date.now() - 3_600_000).toISOString();
  const dayStart = new Date(new Date().setUTCHours(0, 0, 0, 0)).toISOString();
  const ip = ipHash(request);
  const [perHour, perDay, perSession, perWorkspace, perIp, spent] = await Promise.all([
    countWhere(`role=eq.user&user_id=eq.${enc(identity.userId)}&created_at=gte.${enc(hourAgo)}`),
    countWhere(`role=eq.user&user_id=eq.${enc(identity.userId)}&created_at=gte.${enc(dayStart)}`),
    countWhere(`role=eq.user&session_id=eq.${enc(sessionId)}`),
    identity.workspaceId ? countWhere(`role=eq.user&workspace_id=eq.${enc(identity.workspaceId)}&created_at=gte.${enc(dayStart)}`) : Promise.resolve(0),
    countWhere(`role=eq.user&ip_hash=eq.${ip}&created_at=gte.${enc(hourAgo)}`),
    spentSince(dayStart),
  ]);
  if (perIp >= limits.perIpPerHour) return fail("Too many requests. Try again later.", 429);
  if (perHour >= limits.perUserPerHour) return fail("You sent a lot of messages. Try again in an hour.", 429);
  if (perDay >= limits.perUserPerDay || perWorkspace >= limits.perWorkspacePerDay) return fail("Daily message limit reached. Try again tomorrow.", 429);
  if (perSession >= limits.perSessionTotal) return fail("This chat is full. Reload the page to start a new one.", 429);
  if (spent >= budget().dailyUsd * limits.budgetStopAt) return fail("The feedback agent is paused for today. Your earlier messages are saved.", 429);

  // 5. Ask the model, save both sides, report events.
  const result = await runAgent(messages, await recentTopics());
  const cost = costUsd(result.inputTokens ?? 0, result.outputTokens ?? 0);
  const context = { page_url: pageUrl, user_id: identity.userId, user_email: identity.userEmail, workspace_id: identity.workspaceId, session_id: sessionId, ip_hash: ip };
  await saveRows([
    { ...context, role: "user", message: last.content, kind: result.kind, topic: result.topic, sentiment: result.sentiment, summary: result.summary },
    { ...context, role: "assistant", message: result.reply, input_tokens: result.inputTokens, output_tokens: result.outputTokens, cost_usd: cost },
  ]);

  const props = { $current_url: pageUrl, session_id: sessionId, workspace_id: identity.workspaceId, kind: result.kind, topic: result.topic, sentiment: result.sentiment };
  await capture("feedback_message", identity.userId, { ...props, message_length: last.content.length, cost_usd: cost });
  if (result.summary) await capture("feedback_summary", identity.userId, { ...props, summary: result.summary });

  return Response.json({ reply: result.reply });
}
