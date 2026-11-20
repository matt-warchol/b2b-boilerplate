import { supabaseConfig } from "./config";
import type { FeedbackRow } from "./store";

// Feedback -> task -> solution -> email the users who asked -> done.
// Only "todo" tasks count as open work; "done" tasks move to the Done list.

export type FeedbackTask = {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  topic: string | null;
  feedback_ids: string[];
  status: "todo" | "done";
  solution: string | null;
  solution_path: string | null;
  done_at: string | null;
  emailed_at: string | null;
  email_log: { to: string; status: string }[];
};

export type Recipient = { email: string; firstName?: string };

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const mailbox = /^[^\s<>@,;:]+@[^\s<>@,;:]+\.[^\s<>@,;:]+$/;

export function isId(value: string) {
  return uuid.test(value);
}

// Same-site path only, so the email can never point somewhere else.
export function cleanPath(value: string): string | null {
  const v = value.trim();
  if (!v) return null;
  return /^\/[^/\\]/.test(v) && v.length <= 300 && !/\s/.test(v) ? v : null;
}

export function cleanText(value: unknown, max: number) {
  return String(value ?? "").replace(/\s+/g, " ").trim().slice(0, max);
}

// One email per person, whoever asked several times. Skips anonymous rows.
export function recipientsFor(rows: Pick<FeedbackRow, "user_email" | "role">[]): Recipient[] {
  const seen = new Map<string, Recipient>();
  for (const r of rows) {
    const email = r.user_email?.trim().toLowerCase();
    if (r.role !== "user" || !email || !mailbox.test(email) || seen.has(email)) continue;
    seen.set(email, { email });
  }
  return [...seen.values()];
}

export function splitTasks(tasks: FeedbackTask[]) {
  return {
    todo: tasks.filter((t) => t.status === "todo"),
    done: tasks.filter((t) => t.status === "done").sort((a, b) => (b.done_at ?? "").localeCompare(a.done_at ?? "")),
  };
}

// feedback id -> task, so the admin page can show "Task: ..." next to a message.
export function taskByFeedback(tasks: FeedbackTask[]) {
  const map = new Map<string, FeedbackTask>();
  for (const t of tasks) for (const id of t.feedback_ids) map.set(id, t);
  return map;
}

function headers(key: string) {
  return { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" };
}

export async function listTasks(): Promise<FeedbackTask[]> {
  const cfg = supabaseConfig();
  if (!cfg) return [];
  const res = await fetch(`${cfg.url}/rest/v1/feedback_tasks?select=*&order=updated_at.desc&limit=500`, {
    headers: headers(cfg.key),
    cache: "no-store",
  });
  if (!res.ok) {
    console.error("feedback tasks list failed", res.status);
    return [];
  }
  return res.json();
}

export async function getTask(id: string): Promise<FeedbackTask | null> {
  const cfg = supabaseConfig();
  if (!cfg || !isId(id)) return null;
  const res = await fetch(`${cfg.url}/rest/v1/feedback_tasks?select=*&id=eq.${id}&limit=1`, {
    headers: headers(cfg.key),
    cache: "no-store",
  });
  if (!res.ok) return null;
  const rows: FeedbackTask[] = await res.json();
  return rows[0] ?? null;
}

export async function feedbackByIds(ids: string[]): Promise<FeedbackRow[]> {
  const cfg = supabaseConfig();
  const clean = ids.filter(isId);
  if (!cfg || clean.length === 0) return [];
  const res = await fetch(`${cfg.url}/rest/v1/feedback?select=*&id=in.(${clean.join(",")})`, {
    headers: headers(cfg.key),
    cache: "no-store",
  });
  return res.ok ? res.json() : [];
}

export async function createTask(input: { title: string; topic: string | null; feedbackIds: string[] }) {
  const cfg = supabaseConfig();
  if (!cfg) return false;
  const res = await fetch(`${cfg.url}/rest/v1/feedback_tasks`, {
    method: "POST",
    headers: { ...headers(cfg.key), Prefer: "return=minimal" },
    body: JSON.stringify({ title: input.title, topic: input.topic, feedback_ids: input.feedbackIds.filter(isId) }),
  });
  if (!res.ok) console.error("feedback task insert failed", res.status, await res.text());
  return res.ok;
}

export async function updateTask(id: string, patch: Partial<Omit<FeedbackTask, "id" | "created_at">>) {
  const cfg = supabaseConfig();
  if (!cfg || !isId(id)) return false;
  const res = await fetch(`${cfg.url}/rest/v1/feedback_tasks?id=eq.${id}`, {
    method: "PATCH",
    headers: { ...headers(cfg.key), Prefer: "return=minimal" },
    body: JSON.stringify({ ...patch, updated_at: new Date().toISOString() }),
  });
  if (!res.ok) console.error("feedback task update failed", res.status, await res.text());
  return res.ok;
}
