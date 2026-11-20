"use server";

import { redirect } from "next/navigation";
import { sendProductEmail } from "@/features/email/server";
import { isFeedbackAdmin } from "@/lib/feedback/admin-auth";
import { cleanPath, cleanText, createTask, feedbackByIds, getTask, isId, recipientsFor, updateTask } from "@/lib/feedback/tasks";

// Where "Try it now" points when the owner leaves the path empty. Change per product.
const defaultSolutionPath = "/workspace";

function back(days: FormDataEntryValue | null, note?: string): never {
  const d = [1, 7, 30, 90].includes(Number(days)) ? Number(days) : 7;
  redirect(`/admin/feedback?days=${d}${note ? `&note=${note}` : ""}#tasks`);
}

async function requireAdmin() {
  if (!(await isFeedbackAdmin())) redirect("/admin/feedback");
}

// One or more feedback messages become one task. Title is written for the client ("Export contacts to CSV").
export async function createFeedbackTask(formData: FormData) {
  await requireAdmin();
  const feedbackIds = String(formData.get("feedbackIds") ?? "").split(",").map((s) => s.trim()).filter(isId);
  const title = cleanText(formData.get("title"), 200);
  const topic = cleanText(formData.get("topic"), 40) || null;
  if (!title || feedbackIds.length === 0) back(formData.get("days"), "missing");
  const ok = await createTask({ title, topic, feedbackIds });
  back(formData.get("days"), ok ? "created" : "failed");
}

// Attach the solution, optionally email everyone who asked, and move the task to Done.
export async function completeFeedbackTask(formData: FormData) {
  await requireAdmin();
  const days = formData.get("days");
  const task = await getTask(String(formData.get("id") ?? ""));
  if (!task) back(days, "failed");

  const title = cleanText(formData.get("title"), 200) || task.title;
  const solution = cleanText(formData.get("solution"), 2000);
  const rawPath = String(formData.get("solutionPath") ?? "");
  const solutionPath = cleanPath(rawPath);
  if (!solution) back(days, "solution");
  if (rawPath.trim() && !solutionPath) back(days, "path");

  const log = [...(task.email_log ?? [])];
  let emailed = false;
  if (formData.get("notify") === "email") {
    const people = recipientsFor(await feedbackByIds(task.feedback_ids));
    for (const person of people) {
      if (log.some((l) => l.to === person.email && l.status === "accepted")) continue; // never email twice
      try {
        const result = await sendProductEmail({
          eventId: `feedback-task/${task.id}`,
          to: person.email,
          message: { kind: "feedback-shipped", request: title, howItWorks: solution, actionPath: solutionPath ?? defaultSolutionPath },
        });
        log.push({ to: person.email, status: result.status });
        emailed ||= result.status === "accepted" || result.status === "dry-run";
      } catch (error) {
        console.error("feedback shipped email failed", error instanceof Error ? error.message : "unknown");
        log.push({ to: person.email, status: "failed" });
      }
    }
  }

  const now = new Date().toISOString();
  const ok = await updateTask(task.id, {
    title,
    solution,
    solution_path: solutionPath,
    status: "done",
    done_at: now,
    email_log: log,
    ...(emailed ? { emailed_at: now } : {}),
  });
  back(days, ok ? "done" : "failed");
}

export async function reopenFeedbackTask(formData: FormData) {
  await requireAdmin();
  const ok = await updateTask(String(formData.get("id") ?? ""), { status: "todo", done_at: null });
  back(formData.get("days"), ok ? "reopened" : "failed");
}
