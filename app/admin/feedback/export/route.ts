import { buildExport } from "@/lib/feedback/export";
import { isFeedbackAdmin } from "@/lib/feedback/admin-auth";
import { listSince } from "@/lib/feedback/store";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!(await isFeedbackAdmin())) return new Response("Unauthorized", { status: 401 });
  const requested = Number(new URL(request.url).searchParams.get("days"));
  const days = [1, 7, 30, 90].includes(requested) ? requested : 7;
  const rows = await listSince(new Date(Date.now() - days * 86_400_000).toISOString());
  return new Response(buildExport(rows, days), {
    headers: { "Content-Type": "text/markdown; charset=utf-8", "Content-Disposition": `attachment; filename="feedback-${days}d.md"`, "Cache-Control": "no-store", "X-Robots-Tag": "noindex" },
  });
}
