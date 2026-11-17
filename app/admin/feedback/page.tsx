import type { Metadata } from "next";
import { cookies } from "next/headers";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { feedbackAnalysisPrompt } from "@/content/feedback-prompt";
import { CopyPromptButton } from "@/components/feedback/copy-prompt-button";
import { adminCookie, adminCookieValue, adminToken, isFeedbackAdmin, sameSecret } from "@/lib/feedback/admin-auth";
import { supabaseConfig } from "@/lib/feedback/config";
import { buildExport } from "@/lib/feedback/export";
import { groupByTopic, groupByUser, listSince, pathOf } from "@/lib/feedback/store";

export const metadata: Metadata = { title: "Feedback", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

async function unlock(formData: FormData) {
  "use server";
  const token = adminToken();
  const given = String(formData.get("token") ?? "");
  if (token && sameSecret(given, token)) {
    (await cookies()).set(adminCookie, adminCookieValue(token), { httpOnly: true, secure: true, sameSite: "strict", path: "/admin/feedback", maxAge: 60 * 60 * 8 });
  }
  await new Promise((resolve) => setTimeout(resolve, 1500)); // slows down guessing
  redirect("/admin/feedback");
}

export default async function FeedbackAdminPage({ searchParams }: { searchParams: Promise<{ days?: string }> }) {
  const token = adminToken();
  if (!(await isFeedbackAdmin())) {
    return (
      <main className="mx-auto max-w-sm p-6">
        <Card>
          <CardHeader>
            <CardTitle>Feedback</CardTitle>
            <CardDescription>{token ? "Enter the admin token." : "Set FEEDBACK_ADMIN_TOKEN (at least 24 characters) to unlock this page."}</CardDescription>
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
  const users = groupByUser(rows);
  const analysisText = `${feedbackAnalysisPrompt}\n\n---\n\n${buildExport(rows, days)}`.slice(0, 80_000);

  return (
    <main className="mx-auto max-w-4xl space-y-4 p-6">
      <header className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-semibold">Feedback</h1>
          <p className="text-muted-foreground text-sm">{groups.reduce((n, g) => n + g.items.length, 0)} messages in {groups.length} topics, last {days} days</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <CopyPromptButton text={analysisText} />
          <Button asChild size="sm" variant="outline">
            <a href={`/admin/feedback/export?days=${days}`}>Download .md</a>
          </Button>
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
        <Tabs defaultValue="topic">
          <TabsList>
            <TabsTrigger value="topic">By topic</TabsTrigger>
            <TabsTrigger value="user">By user and page</TabsTrigger>
          </TabsList>
          <TabsContent value="topic">
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
                            <TableCell className="max-w-40 truncate">{pathOf(i.page_url)}</TableCell>
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
          </TabsContent>
          <TabsContent value="user">
            <Accordion type="multiple" defaultValue={users.slice(0, 1).map((u) => u.user)}>
              {users.map((u) => (
                <AccordionItem key={u.user} value={u.user}>
                  <AccordionTrigger>
                    <span className="flex flex-1 items-center gap-2">
                      <span className="font-medium">{u.user}</span>
                      {u.workspace && <span className="text-muted-foreground text-xs">{u.workspace}</span>}
                      <Badge variant="secondary">{u.items.length}</Badge>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Page</TableHead>
                          <TableHead>Message</TableHead>
                          <TableHead>Topic</TableHead>
                          <TableHead>When</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {u.items.map((i) => (
                          <TableRow key={i.id}>
                            <TableCell className="max-w-40 truncate">{pathOf(i.page_url)}</TableCell>
                            <TableCell className="max-w-xs whitespace-normal">{i.message}</TableCell>
                            <TableCell>{i.topic ?? "-"}</TableCell>
                            <TableCell>{i.created_at ? new Date(i.created_at).toLocaleString("en-GB") : ""}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </TabsContent>
        </Tabs>
      )}
    </main>
  );
}
