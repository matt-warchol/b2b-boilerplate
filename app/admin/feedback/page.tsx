import type { Metadata } from "next";
import { cookies } from "next/headers";
import { timingSafeEqual } from "node:crypto";
import { redirect } from "next/navigation";
import { MessageSquareText } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabaseConfig } from "@/lib/feedback/config";
import { groupByTopic, listSince } from "@/lib/feedback/store";

export const metadata: Metadata = { title: "Feedback", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const cookieName = "feedback_admin";

function same(a: string, b: string) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

async function unlock(formData: FormData) {
  "use server";
  const token = process.env.FEEDBACK_ADMIN_TOKEN;
  const given = String(formData.get("token") ?? "");
  if (token && same(given, token)) {
    (await cookies()).set(cookieName, given, { httpOnly: true, secure: true, sameSite: "strict", path: "/admin/feedback", maxAge: 60 * 60 * 8 });
  }
  redirect("/admin/feedback");
}

export default async function FeedbackAdminPage({ searchParams }: { searchParams: Promise<{ days?: string }> }) {
  const token = process.env.FEEDBACK_ADMIN_TOKEN;
  const saved = (await cookies()).get(cookieName)?.value ?? "";
  if (!token || !same(saved, token)) {
    return (
      <main className="mx-auto max-w-sm p-6">
        <Card>
          <CardHeader>
            <CardTitle>Feedback</CardTitle>
            <CardDescription>{token ? "Enter the admin token." : "Set FEEDBACK_ADMIN_TOKEN to unlock this page."}</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={unlock} className="flex gap-2">
              <Input name="token" type="password" aria-label="Admin token" autoComplete="off" disabled={!token} />
              <Button type="submit" disabled={!token}>Unlock</Button>
            </form>
          </CardContent>
        </Card>
      </main>
    );
  }

  const { days: daysParam } = await searchParams;
  const days = [1, 7, 30, 90].includes(Number(daysParam)) ? Number(daysParam) : 7;
  const rows = await listSince(new Date(Date.now() - days * 86_400_000).toISOString());
  const groups = groupByTopic(rows);

  return (
    <main className="mx-auto max-w-4xl space-y-4 p-6">
      <header className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-semibold">Feedback</h1>
          <p className="text-muted-foreground text-sm">{groups.reduce((n, g) => n + g.items.length, 0)} messages in {groups.length} topics, last {days} days</p>
        </div>
        <nav className="flex gap-1" aria-label="Time range">
          {[1, 7, 30, 90].map((d) => (
            <Button key={d} asChild size="sm" variant={d === days ? "default" : "outline"}>
              <a href={`/admin/feedback?days=${d}`}>{d}d</a>
            </Button>
          ))}
        </nav>
      </header>

      {!supabaseConfig() && (
        <Alert>
          <AlertTitle>Supabase is not configured</AlertTitle>
          <AlertDescription>Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY and apply supabase/feedback.sql.</AlertDescription>
        </Alert>
      )}

      {groups.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon"><MessageSquareText aria-hidden="true" /></EmptyMedia>
            <EmptyTitle>No feedback yet</EmptyTitle>
            <EmptyDescription>Messages from the chat widget appear here, grouped by topic.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <Accordion type="multiple" defaultValue={groups.slice(0, 1).map((g) => g.topic)}>
          {groups.map((g) => (
            <AccordionItem key={g.topic} value={g.topic}>
              <AccordionTrigger>
                <span className="flex flex-1 items-center gap-2">
                  <span className="font-medium">{g.topic}</span>
                  <Badge variant="secondary">{g.items.length}</Badge>
                  {g.negative > 0 && <Badge variant="destructive">{g.negative} negative</Badge>}
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Message</TableHead>
                      <TableHead>Page</TableHead>
                      <TableHead>User / workspace</TableHead>
                      <TableHead>When</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {g.items.map((i) => (
                      <TableRow key={i.id}>
                        <TableCell className="max-w-xs whitespace-normal">{i.summary ?? i.message}</TableCell>
                        <TableCell className="max-w-40 truncate">{i.page_url ?? "-"}</TableCell>
                        <TableCell>{i.user_email ?? i.user_id ?? "anonymous"}{i.workspace_id ? ` / ${i.workspace_id}` : ""}</TableCell>
                        <TableCell>{i.created_at ? new Date(i.created_at).toLocaleString("en-GB") : ""}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </main>
  );
}
