import { supabaseConfig } from "./config";

export type FeedbackRow = {
  id?: string;
  created_at?: string;
  session_id: string;
  role: "user" | "assistant";
  message: string;
  page_url: string | null;
  user_id: string | null;
  user_email: string | null;
  workspace_id: string | null;
  kind?: "question" | "feedback" | "bug" | "idea" | null;
  topic?: string | null;
  sentiment?: "positive" | "neutral" | "negative" | null;
  summary?: string | null;
};

function headers(key: string) {
  return { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" };
}

export async function saveRows(rows: FeedbackRow[]) {
  const cfg = supabaseConfig();
  if (!cfg) return false;
  const res = await fetch(`${cfg.url}/rest/v1/feedback`, {
    method: "POST",
    headers: { ...headers(cfg.key), Prefer: "return=minimal" },
    body: JSON.stringify(rows),
  });
  if (!res.ok) console.error("feedback insert failed", res.status, await res.text());
  return res.ok;
}

export async function listSince(sinceIso: string, limit = 1000): Promise<FeedbackRow[]> {
  const cfg = supabaseConfig();
  if (!cfg) return [];
  const query = `select=*&created_at=gte.${encodeURIComponent(sinceIso)}&order=created_at.desc&limit=${limit}`;
  const res = await fetch(`${cfg.url}/rest/v1/feedback?${query}`, { headers: headers(cfg.key), cache: "no-store" });
  if (!res.ok) {
    console.error("feedback list failed", res.status);
    return [];
  }
  return res.json();
}

export async function recentTopics(days = 30): Promise<string[]> {
  const since = new Date(Date.now() - days * 86_400_000).toISOString();
  const rows = await listSince(since, 500);
  const counts = new Map<string, number>();
  for (const r of rows) if (r.role === "user" && r.topic) counts.set(r.topic, (counts.get(r.topic) ?? 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 15).map(([t]) => t);
}

export function groupByTopic(rows: FeedbackRow[]) {
  const groups = new Map<string, FeedbackRow[]>();
  for (const r of rows) {
    if (r.role !== "user") continue;
    const key = r.topic?.trim() || "uncategorized";
    groups.set(key, [...(groups.get(key) ?? []), r]);
  }
  return [...groups.entries()]
    .map(([topic, items]) => ({
      topic,
      items,
      negative: items.filter((i) => i.sentiment === "negative").length,
      sessions: new Set(items.map((i) => i.session_id)).size,
    }))
    .sort((a, b) => b.items.length - a.items.length);
}
