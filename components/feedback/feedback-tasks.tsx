import { CheckCircle2, ListTodo, Mail, RotateCcw } from "lucide-react";
import { completeFeedbackTask, createFeedbackTask, reopenFeedbackTask } from "@/app/admin/feedback/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemTitle } from "@/components/ui/item";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import type { FeedbackTask } from "@/lib/feedback/tasks";

const day = (iso: string | null) => (iso ? new Date(iso).toLocaleDateString("en-GB") : "");

function emailSummary(task: FeedbackTask) {
  const log = task.email_log ?? [];
  if (log.length === 0) return "Not emailed";
  const sent = log.filter((l) => l.status === "accepted").length;
  const dry = log.filter((l) => l.status === "dry-run").length;
  const failed = log.filter((l) => l.status === "failed").length;
  return [sent && `Emailed ${sent}`, dry && `${dry} dry-run`, failed && `${failed} failed`].filter(Boolean).join(", ") || "Not emailed";
}

/** "Create task" next to one message or a whole topic. Hidden when every message already has a task. */
export function CreateTaskButton({ feedbackIds, title, topic, days, label = "Create task" }: { feedbackIds: string[]; title: string; topic: string | null; days: number; label?: string }) {
  if (feedbackIds.length === 0) return null;
  return (
    <form action={createFeedbackTask}>
      <Input type="hidden" name="feedbackIds" value={feedbackIds.join(",")} />
      <Input type="hidden" name="title" value={title.slice(0, 200)} />
      <Input type="hidden" name="topic" value={topic ?? ""} />
      <Input type="hidden" name="days" value={days} />
      <Button type="submit" size="sm" variant="outline">
        <ListTodo aria-hidden="true" />
        {label}
      </Button>
    </form>
  );
}

export function TaskStatusBadge({ task }: { task: FeedbackTask }) {
  return <Badge variant={task.status === "done" ? "default" : "secondary"}>{task.status === "done" ? "Done" : "Task"}</Badge>;
}

export function FeedbackTasks({ todo, done, days, recipients }: { todo: FeedbackTask[]; done: FeedbackTask[]; days: number; recipients: Map<string, number> }) {
  return (
    <section id="tasks" className="space-y-4" aria-label="Feedback tasks">
      <Card>
        <CardHeader>
          <CardTitle>To do ({todo.length})</CardTitle>
          <CardDescription>Feedback you decided to build. Add how it works now, then mark it done. Only these count as open tasks.</CardDescription>
        </CardHeader>
        <CardContent>
          {todo.length === 0 ? (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon"><ListTodo aria-hidden="true" /></EmptyMedia>
                <EmptyTitle>No open tasks</EmptyTitle>
                <EmptyDescription>Use Create task on a message or a topic below.</EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <ItemGroup className="gap-3">
              {todo.map((t) => {
                const people = recipients.get(t.id) ?? 0;
                return (
                  <Item key={t.id} variant="outline" className="flex-col items-stretch">
                    <ItemContent>
                      <ItemTitle>{t.title}</ItemTitle>
                      <ItemDescription>
                        {t.feedback_ids.length} message{t.feedback_ids.length === 1 ? "" : "s"} · {people} {people === 1 ? "person" : "people"} to email{t.topic ? ` · ${t.topic}` : ""} · added {day(t.created_at)}
                      </ItemDescription>
                    </ItemContent>
                    <form action={completeFeedbackTask} className="grid gap-3">
                      <Input type="hidden" name="id" value={t.id} />
                      <Input type="hidden" name="days" value={days} />
                      <div className="grid gap-1.5">
                        <Label htmlFor={`title-${t.id}`}>What they asked for (shown in the email)</Label>
                        <Input id={`title-${t.id}`} name="title" defaultValue={t.title} maxLength={200} required />
                      </div>
                      <div className="grid gap-1.5">
                        <Label htmlFor={`solution-${t.id}`}>How it works now</Label>
                        <Textarea id={`solution-${t.id}`} name="solution" defaultValue={t.solution ?? ""} maxLength={2000} rows={3} placeholder="Open People, filter the list, then click Export." required />
                      </div>
                      <div className="grid gap-1.5">
                        <Label htmlFor={`path-${t.id}`}>Link in the product (optional)</Label>
                        <Input id={`path-${t.id}`} name="solutionPath" defaultValue={t.solution_path ?? ""} placeholder="/crm/people" maxLength={300} />
                      </div>
                      <ItemActions className="flex-wrap">
                        <Button type="submit" name="notify" value="email" size="sm" disabled={people === 0}>
                          <Mail aria-hidden="true" />
                          Done + email {people} {people === 1 ? "person" : "people"}
                        </Button>
                        <Button type="submit" name="notify" value="none" size="sm" variant="outline">
                          <CheckCircle2 aria-hidden="true" />
                          Done, no email
                        </Button>
                      </ItemActions>
                    </form>
                  </Item>
                );
              })}
            </ItemGroup>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Done ({done.length})</CardTitle>
          <CardDescription>Shipped from feedback. Not counted as open tasks.</CardDescription>
        </CardHeader>
        <CardContent>
          {done.length === 0 ? (
            <p className="text-muted-foreground text-sm">Nothing shipped from feedback yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Task</TableHead>
                  <TableHead>How it works now</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Done</TableHead>
                  <TableHead className="sr-only">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {done.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell className="max-w-48 whitespace-normal font-medium">{t.title}</TableCell>
                    <TableCell className="max-w-xs whitespace-normal">{t.solution}{t.solution_path ? ` (${t.solution_path})` : ""}</TableCell>
                    <TableCell>{emailSummary(t)}</TableCell>
                    <TableCell>{day(t.done_at)}</TableCell>
                    <TableCell>
                      <form action={reopenFeedbackTask}>
                        <Input type="hidden" name="id" value={t.id} />
                        <Input type="hidden" name="days" value={days} />
                        <Button type="submit" size="sm" variant="ghost">
                          <RotateCcw aria-hidden="true" />
                          Reopen
                        </Button>
                      </form>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
