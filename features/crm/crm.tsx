"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, MotionConfig } from "motion/react";
import {
  ArrowUpRight,
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Clock3,
  Inbox,
  ListTodo,
  Mail,
  MoreHorizontal,
  Pause,
  Play,
  Plus,
  Search,
  Send,
  SlidersHorizontal,
  Users,
  X,
  Columns3,
  Globe,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  people,
  deals,
  initialCampaigns,
  initialSequence,
  initialTasks,
  type Person,
  type Campaign,
} from "./data";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Badge as UIBadge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { AppSidebar, SiteHeader } from "./dashboard-shell";
import { InboxPanel, inboxContacts } from "./inbox-panel";
import { RecordAvatar as Avatar } from "./record-avatar";
import { SectionCards, type Metric } from "./section-cards";
import { useSaved } from "@/lib/use-demo-storage";
import { OutboundChart } from "./outbound-chart";

const titles: Record<string, string> = {
  overview: "Overview",
  inbox: "Inbox",
  tasks: "My tasks",
  people: "People",
  companies: "Companies",
  pipeline: "Pipeline",
  campaigns: "Campaigns",
  templates: "Templates",
  analytics: "Analytics",
  settings: "Settings",
};
const money = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);

function Badge({ text }: { text: string }) {
  const tone = [
    "Active",
    "Interested",
    "Meeting booked",
    "Won",
    "Healthy",
  ].includes(text)
    ? "green"
    : ["Draft", "New", "Paused"].includes(text)
      ? "gray"
      : "violet";
  return (
    <UIBadge variant="secondary" className={"crm-badge " + tone}>
      {text}
    </UIBadge>
  );
}
export function CRM({ view }: { view: string }) {
  return (
    <SidebarProvider
      className="crm-app"
      style={
        {
          "--sidebar-width": "16rem",
          "--header-height": "3.5rem",
        } as React.CSSProperties
      }
    >
      <CRMLayout key={view} view={view} />
    </SidebarProvider>
  );
}

function CRMLayout({ view }: { view: string }) {
  const [campaigns, setCampaigns, storageError] = useSaved<Campaign[]>(
    "folio.campaigns.v1",
    initialCampaigns,
  );
  const [tasks, setTasks] = useSaved("folio.tasks.v1", initialTasks);
  const [sequence, setSequence] = useSaved(
    "folio.sequence.v1",
    initialSequence,
  );
  const [pipeline, setPipeline] = useSaved("folio.pipeline.v1", deals);
  const [dragging, setDragging] = useState<string | null>(null);
  const [dropStage, setDropStage] = useState<string | null>(null);
  const moveDeal = (company: string, stage: string) =>
    setPipeline(
      pipeline.map((item) =>
        item.company === company ? { ...item, stage } : item,
      ),
    );
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [person, setPerson] = useState<Person | null>(null);
  const [campaignId, setCampaignId] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  const [compose, setCompose] = useState(false);
  const [message, setMessage] = useState("");
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCompose(true);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const [drafts, setDrafts] = useSaved<Record<string, string>>(
    "folio.replies.v1",
    {},
  );
  const [preferences, setPreferences] = useSaved("folio.preferences.v1", {
    workspace: "Studio workspace",
    timezone: "Europe / Madrid",
  });
  const activeCampaign = campaigns.find((c) => c.id === campaignId);
  const records = people.filter(
    (p) =>
      (p.name + p.company + p.email)
        .toLowerCase()
        .includes(search.toLowerCase()) &&
      (filter === "All" ||
        (filter === "My contacts" ? p.owner === "You" : p.status === filter)),
  );
  const filteredCampaigns = campaigns.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) &&
      (filter === "All" || c.status === filter),
  );
  const totalSent = campaigns.reduce((sum, c) => sum + c.sent, 0);
  const totalReplies = campaigns.reduce((sum, c) => sum + c.replies, 0);
  function notify(text: string) {
    setMessage(text);
  }
  function campaignStatus(status: string) {
    setCampaigns(
      campaigns.map((c) => (c.id === campaignId ? { ...c, status } : c)),
    );
    notify(
      status === "Active"
        ? "Campaign simulation started. No emails will be sent."
        : "Campaign paused in this demo.",
    );
  }
  const tools = (
    <div className="crm-table-tools">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            <span>View: {filter}</span>
            <ChevronDown />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuRadioGroup value={filter} onValueChange={setFilter}>
            {(view === "campaigns"
              ? ["All", "Active", "Paused", "Draft"]
              : ["All", "My contacts", "Interested", "Meeting booked"]
            ).map((tab) => (
              <DropdownMenuRadioItem key={tab} value={tab}>
                {tab}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <label className="crm-search">
        <Search size={15} />
        <Input
          aria-label="Search records"
          placeholder={
            view === "campaigns"
              ? "Search campaigns..."
              : "Search people or companies..."
          }
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </label>
    </div>
  );
  function peopleTable() {
    return (
      <div className="crm-table-scroll">
        <Table className="crm-table">
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Fit score</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Last activity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.map((p, i) => (
              <TableRow key={p.email}>
                <TableCell>
                  <button className="crm-person" onClick={() => setPerson(p)}>
                    <Avatar name={p.name} color={p.color} />
                    <span>
                      <strong>{p.name}</strong>
                      <small>{p.role}</small>
                    </span>
                  </button>
                </TableCell>
                <TableCell>
                  <span className="crm-company">
                    <Avatar name={p.company} color={p.color} square />
                    {p.company}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge text={p.status} />
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {p.score}
                </TableCell>
                <TableCell>
                  <span className="flex items-center gap-2">
                    <Avatar name={p.owner} className="size-6" />
                    {p.owner}
                  </span>
                </TableCell>
                <TableCell className="muted">{i + 1}h ago</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {!records.length && (
          <p className="crm-empty">
            No records match. Try a different name or view.
          </p>
        )}
      </div>
    );
  }

  const openDeals = pipeline.filter((deal) => deal.stage !== "Won");
  const metrics: Metric[] = [
    {
      label: "Active pipeline",
      value: money(openDeals.reduce((sum, deal) => sum + deal.value, 0)),
      icon: Columns3,
      context: `${openDeals.length} open deals`,
    },
    {
      label: "Emails sent",
      value: totalSent.toLocaleString("en-US"),
      icon: Send,
      context: `Across ${campaigns.filter((c) => c.sent > 0).length} campaigns`,
    },
    {
      label: "Replies received",
      value: totalReplies.toLocaleString("en-US"),
      icon: Inbox,
      change: totalSent
        ? ((totalReplies / totalSent) * 100).toFixed(1) + "%"
        : undefined,
      context: "Overall reply rate",
    },
    {
      label: "Meetings booked",
      value: campaigns
        .reduce((sum, c) => sum + c.meetings, 0)
        .toLocaleString("en-US"),
      icon: Users,
      context: "From outbound campaigns",
    },
  ];

  return (
    <MotionConfig reducedMotion="user">
      <>
        <a href="#crm-main" className="skip-link">
          Skip to workspace
        </a>
        <AppSidebar
          view={view}
          workspace={preferences.workspace}
          taskCount={tasks.filter((task) => !task.done).length}
          inboxCount={inboxContacts.length}
          onCreate={() => setCompose(true)}
        />
        <SidebarInset className="min-w-0" id="crm-main" tabIndex={-1}>
          <SiteHeader title={titles[view]} />
          <div className="crm-main">
            <motion.div
              key={view}
              initial={{ opacity: 0.6, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="grid gap-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
                    {view === "overview"
                      ? "A good day to make connections."
                      : titles[view]}
                  </h1>
                  <p className="mt-2 text-base text-muted-foreground">
                    {
                      (
                        {
                          overview:
                            "Here’s what’s happening across your relationships and outreach.",
                          people: "The people behind your next opportunity.",
                          companies:
                            "A shared view of the companies you’re building relationships with.",
                          pipeline:
                            "From the first conversation to a signed agreement.",
                          campaigns:
                            "Thoughtful outreach. Every conversation in context.",
                          inbox:
                            "Every reply, right where the relationship lives.",
                          tasks: "A little follow-through goes a long way.",
                          templates:
                            "Good conversations start with the right words.",
                          analytics:
                            "Understand what’s turning outreach into opportunities.",
                          settings: "Make this workspace feel like yours.",
                        } as Record<string, string>
                      )[view]
                    }
                  </p>
                </div>
                {view === "campaigns" && (
                  <Button onClick={() => setCompose(true)}>
                    <Plus /> Create campaign
                  </Button>
                )}
              </div>
              {(view === "overview" || view === "analytics") && (
                <>
                  <SectionCards metrics={metrics} />
                  <div className="crm-overview-grid">
                    <OutboundChart />
                    <Card className="crm-panel activity">
                      <div className="crm-panel-title">
                        <h2>Recent activity</h2>
                        <span className="muted">Today</span>
                      </div>
                      {[
                        [
                          "Olivia Chen",
                          "replied to your campaign",
                          "SaaS founders",
                          "12 min ago",
                          "lilac",
                        ],
                        [
                          "Sophie Laurent",
                          "booked a discovery call",
                          "Growth leaders",
                          "48 min ago",
                          "mint",
                        ],
                        [
                          "Marcus Reed",
                          "moved to Discovery",
                          "Annual team plan",
                          "1 hour ago",
                          "peach",
                        ],
                        [
                          "Amara Okafor",
                          "replied with interest",
                          "Agency partnerships",
                          "2 hours ago",
                          "pink",
                        ],
                      ].map(([name, action, context, time, color]) => (
                        <button
                          className="activity-row"
                          key={name}
                          onClick={() =>
                            setPerson(
                              people.find((p) => p.name === name) ?? null,
                            )
                          }
                        >
                          <Avatar name={name} color={color} />
                          <span>
                            <strong>{name}</strong> {action}
                            <small>
                              {context}
                              <time>{time}</time>
                            </small>
                          </span>
                        </button>
                      ))}
                      <Link className="panel-footer-link" href="/crm/inbox">
                        Open your inbox <ArrowRight size={14} />
                      </Link>
                    </Card>
                  </div>
                  <Card className="crm-panel">
                    <div className="crm-panel-title">
                      <div>
                        <h2>People to keep close</h2>
                        <p>A few warm conversations worth your attention</p>
                      </div>
                      <Link href="/crm/people">
                        View all people <ArrowRight size={14} />
                      </Link>
                    </div>
                    {peopleTable()}
                  </Card>
                </>
              )}
              {(view === "people" || view === "companies") && (
                <Card className="crm-panel">
                  {tools}
                  {view === "people" ? (
                    peopleTable()
                  ) : (
                    <div className="crm-company-grid">
                      {records.map((p, i) => (
                        <button
                          className="company-card"
                          key={p.email}
                          onClick={() => setPerson(p)}
                        >
                          <Avatar name={p.company} color={p.color} square />
                          <h2>{p.company}</h2>
                          <p>
                            {
                              [
                                "Business software",
                                "Design & collaboration",
                                "Revenue intelligence",
                                "Data infrastructure",
                              ][i % 4]
                            }
                          </p>
                          <span>
                            <Globe size={13} />
                            {p.company.toLowerCase()}.example
                          </span>
                          <div>
                            <Badge text={p.status} />
                            <span>{20 + i * 12} employees</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </Card>
              )}
              {view === "pipeline" && (
                <>
                  <div className="pipeline-summary">
                    <span>Sales pipeline</span>
                    <strong>
                      {money(pipeline.reduce((s, d) => s + d.value, 0))}
                    </strong>
                    <span>{pipeline.length} opportunities</span>
                  </div>
                  <div className="crm-kanban">
                    {["Qualified", "Discovery", "Proposal", "Won"].map(
                      (stage) => (
                        <section
                          key={stage}
                          aria-label={stage + " stage"}
                          data-drop={dropStage === stage ? "" : undefined}
                          onDragOver={(e) => {
                            if (!dragging) return;
                            e.preventDefault();
                            e.dataTransfer.dropEffect = "move";
                            if (dropStage !== stage) setDropStage(stage);
                          }}
                          onDragLeave={(e) => {
                            if (!e.currentTarget.contains(e.relatedTarget as Node))
                              setDropStage(null);
                          }}
                          onDrop={(e) => {
                            e.preventDefault();
                            const company = e.dataTransfer.getData("text/plain");
                            if (company) moveDeal(company, stage);
                            setDropStage(null);
                            setDragging(null);
                          }}
                        >
                          <header>
                            <span
                              className={"stage-dot " + stage.toLowerCase()}
                            />
                            <h2>{stage}</h2>
                            <span>
                              {pipeline.filter((d) => d.stage === stage).length}
                            </span>
                          </header>
                          <p className="lane-total">
                            {money(
                              pipeline
                                .filter((d) => d.stage === stage)
                                .reduce((s, d) => s + d.value, 0),
                            )}
                          </p>
                          {pipeline
                            .filter((d) => d.stage === stage)
                            .map((d) => (
                              <motion.article
                                layout
                                className="deal-card"
                                key={d.company}
                                data-dragging={
                                  dragging === d.company ? "" : undefined
                                }
                              >
                                <div
                                  className="deal-drag"
                                  draggable
                                  title="Drag to another stage"
                                  onDragStart={(e) => {
                                    e.dataTransfer.setData("text/plain", d.company);
                                    e.dataTransfer.effectAllowed = "move";
                                    setDragging(d.company);
                                  }}
                                  onDragEnd={() => {
                                    setDragging(null);
                                    setDropStage(null);
                                  }}
                                >
                                <div className="deal-head">
                                  <Avatar
                                    name={d.company}
                                    color={d.color}
                                    square
                                  />
                                  <strong>{d.company}</strong>
                                </div>
                                <h3>{d.title}</h3>
                                <strong className="deal-value">
                                  {money(d.value)}
                                </strong>
                                <footer>
                                  <Avatar name={d.person} color={d.color} />
                                  <span>{d.person}</span>
                                </footer>
                                </div>
                                <label
                                  className="sr-only"
                                  htmlFor={"stage-" + d.company}
                                >
                                  Stage for {d.company}
                                </label>
                                <Select
                                  value={stage}
                                  onValueChange={(value) =>
                                    moveDeal(d.company, value)
                                  }
                                >
                                  <SelectTrigger
                                    id={"stage-" + d.company}
                                    size="sm"
                                    className="deal-stage w-full bg-background"
                                  >
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {[
                                      "Qualified",
                                      "Discovery",
                                      "Proposal",
                                      "Won",
                                    ].map((s) => (
                                      <SelectItem key={s} value={s}>
                                        {s}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </motion.article>
                            ))}
                        </section>
                      ),
                    )}
                  </div>
                </>
              )}
              {view === "campaigns" && (
                <>
                  <div className="campaign-summary">
                    <span>
                      <i className="status-dot" />
                      {
                        campaigns.filter((c) => c.status === "Active").length
                      }{" "}
                      active campaigns
                    </span>
                    <span>{totalSent.toLocaleString()} sample emails sent</span>
                    <span>{totalReplies} replies</span>
                  </div>
                  <Card className="crm-panel">
                    {tools}
                    <div className="crm-table-scroll">
                      <Table className="crm-table campaign-table">
                        <TableHeader>
                          <TableRow>
                            <TableHead>Campaign</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">
                              Contacts
                            </TableHead>
                            <TableHead className="text-right">Sent</TableHead>
                            <TableHead className="text-right">
                              Reply rate
                            </TableHead>
                            <TableHead className="text-right">
                              Meetings
                            </TableHead>
                            <TableHead />
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredCampaigns.map((c) => (
                            <TableRow key={c.id}>
                              <TableCell>
                                <button
                                  className="crm-person"
                                  onClick={() => setCampaignId(c.id)}
                                >
                                  <span className={"campaign-icon " + c.color}>
                                    <Send size={18} />
                                  </span>
                                  <span>
                                    <strong>{c.name}</strong>
                                    <small>{c.audience}</small>
                                  </span>
                                </button>
                              </TableCell>
                              <TableCell>
                                <Badge text={c.status} />
                              </TableCell>
                              <TableCell className="text-right tabular-nums">
                                {c.contacts.toLocaleString("en-US")}
                              </TableCell>
                              <TableCell className="text-right tabular-nums">
                                {c.sent.toLocaleString("en-US")}
                              </TableCell>
                              <TableCell className="text-right tabular-nums">
                                {c.sent
                                  ? ((c.replies / c.sent) * 100).toFixed(1) +
                                    "%"
                                  : "—"}
                              </TableCell>
                              <TableCell className="text-right tabular-nums">
                                {c.meetings.toLocaleString("en-US")}
                              </TableCell>
                              <TableCell>
                                <DropdownMenu modal={false}>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      aria-label={"Actions for " + c.name}
                                    >
                                      <MoreHorizontal />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent
                                    align="end"
                                    onCloseAutoFocus={(event) => {
                                      if (campaignId === c.id)
                                        event.preventDefault();
                                    }}
                                  >
                                    <DropdownMenuItem
                                      onSelect={() => {
                                        setStep(0);
                                        setCampaignId(c.id);
                                      }}
                                    >
                                      Edit sequence
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      {!filteredCampaigns.length && (
                        <p className="crm-empty">No campaigns in this view.</p>
                      )}
                    </div>
                  </Card>
                  <div className="campaign-bottom">
                    <span>
                      <CheckCircle2 size={16} /> Sequences stop on reply
                    </span>
                    <span>
                      <Clock3 size={16} /> Weekday sending windows
                    </span>
                    <span>
                      <SlidersHorizontal size={16} /> Per-mailbox daily limits
                    </span>
                  </div>
                  <p className="muted demo-caption">
                    Sending rules are illustrated in this demo. Connect a
                    delivery provider to send real campaigns.
                  </p>
                </>
              )}
              {view === "inbox" && (
                <InboxPanel
                  drafts={drafts}
                  onSave={(email, text) => {
                    setDrafts({ ...drafts, [email]: text });
                    notify("Reply draft saved in this browser.");
                  }}
                />
              )}
              {view === "tasks" && (
                <Card className="crm-panel task-panel">
                  <div className="crm-panel-title">
                    <h2>Your next steps</h2>
                    <span className="muted">
                      {tasks.filter((t) => !t.done).length} remaining
                    </span>
                  </div>
                  {tasks.map((task, i) => (
                    <label
                      className={"task-row " + (task.done ? "done" : "")}
                      key={task.title}
                    >
                      <Input
                        type="checkbox"
                        checked={task.done}
                        onChange={() =>
                          setTasks(
                            tasks.map((t, j) =>
                              i === j ? { ...t, done: !t.done } : t,
                            ),
                          )
                        }
                      />
                      <span>
                        <strong>{task.title}</strong>
                        <small>{task.company}</small>
                      </span>
                      <span className="task-date">{task.date}</span>
                    </label>
                  ))}
                </Card>
              )}
              {view === "templates" && (
                <div className="template-grid">
                  {sequence.map((item, i) => (
                    <button
                      className="crm-panel template-card"
                      key={i}
                      onClick={() => {
                        setStep(i);
                        setCampaignId(campaigns[0].id);
                      }}
                    >
                      <span
                        className={
                          "campaign-icon " + ["lilac", "mint", "peach"][i]
                        }
                      >
                        <Mail size={22} />
                      </span>
                      <h2>{item.title}</h2>
                      <p>{item.body.slice(0, 150)}...</p>
                      <footer>
                        Open in sequence editor <ArrowUpRight size={14} />
                      </footer>
                    </button>
                  ))}
                </div>
              )}
              {view === "settings" && (
                <Card className="crm-panel settings-panel">
                  <h2>Workspace preferences</h2>
                  <p>Customize the demo workspace on this device.</p>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const form = new FormData(e.currentTarget);
                      setPreferences({
                        workspace: String(form.get("workspace")),
                        timezone: String(form.get("timezone")),
                      });
                      notify("Workspace preferences saved.");
                    }}
                  >
                    <label>
                      Workspace name
                      <Input
                        name="workspace"
                        defaultValue={preferences.workspace}
                        key={preferences.workspace}
                        required
                      />
                    </label>
                    <label>
                      Default timezone
                      <Select
                        name="timezone"
                        defaultValue={preferences.timezone}
                        key={preferences.timezone}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[
                            "Europe / Madrid",
                            "Europe / London",
                            "America / New York",
                          ].map((zone) => (
                            <SelectItem key={zone} value={zone}>
                              {zone}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </label>
                    <Button type="submit">Save preferences</Button>
                  </form>
                  <hr />
                  <h2>Connected mailboxes</h2>
                  <div className="mailbox-row">
                    <span className="campaign-icon blue">
                      <Mail size={20} />
                    </span>
                    <span>
                      alex@studio.example
                      <small>Sample mailbox · Delivery is simulated</small>
                    </span>
                    <Badge text="Healthy" />
                  </div>
                </Card>
              )}
              <footer className="crm-demo-footer">
                <span>Folidock demo · Fictional contacts and activity</span>
                <Link href="/workspace">
                  Explore the tender workspace <ArrowUpRight size={12} />
                </Link>
              </footer>
            </motion.div>
          </div>
        </SidebarInset>
        {(message || storageError) && (
          <div role="status" className="crm-toast">
            <CheckCircle2 size={17} />
            {message || storageError}
            <button
              aria-label="Dismiss notification"
              onClick={() => setMessage("")}
            >
              <X size={14} />
            </button>
          </div>
        )}
        <Sheet
          open={!!person}
          onOpenChange={(open) => {
            if (!open) setPerson(null);
          }}
        >
          <SheetContent className="p-6 overflow-y-auto">
            {person && (
              <div className="crm-record">
                <Avatar name={person.name} color={person.color} />
                <SheetTitle>{person.name}</SheetTitle>
                <SheetDescription>
                  {person.role} at {person.company}
                </SheetDescription>
                <Badge text={person.status} />
                <dl>
                  <dt>Email</dt>
                  <dd>{person.email}</dd>
                  <dt>Company</dt>
                  <dd>{person.company}</dd>
                  <dt>Owner</dt>
                  <dd>{person.owner}</dd>
                  <dt>Fit score</dt>
                  <dd>{person.score} / 100</dd>
                </dl>
                <h3>Relationship timeline</h3>
                <p>
                  <Mail size={15} /> Introduction sent{" "}
                  <small>November 12</small>
                </p>
                <p>
                  <Inbox size={15} /> Reply received <small>November 15</small>
                </p>
                <Link className="crm-text-link" href="/crm/inbox">
                  Open conversations <ArrowRight size={14} />
                </Link>
              </div>
            )}
          </SheetContent>
        </Sheet>
        <Sheet
          open={!!activeCampaign}
          onOpenChange={(open) => {
            if (!open) setCampaignId(null);
          }}
        >
          <SheetContent className="crm-sequence-sheet p-6 overflow-y-auto sm:max-w-xl">
            {activeCampaign && (
              <div className="sequence-editor">
                <SheetTitle>{activeCampaign.name}</SheetTitle>
                <SheetDescription>
                  Edit the sample sequence. All campaigns share these demo
                  templates.
                </SheetDescription>
                <div className="sequence-status">
                  <Badge text={activeCampaign.status} />
                  <Button
                    size="sm"
                    onClick={() =>
                      campaignStatus(
                        activeCampaign.status === "Active"
                          ? "Paused"
                          : "Active",
                      )
                    }
                  >
                    {activeCampaign.status === "Active" ? (
                      <Pause size={13} />
                    ) : (
                      <Play size={13} />
                    )}{" "}
                    {activeCampaign.status === "Active"
                      ? "Pause simulation"
                      : "Start simulation"}
                  </Button>
                </div>
                {message && <p role="status">{message}</p>}
                <div className="sequence-steps">
                  {sequence.map((item, i) => (
                    <button
                      key={i}
                      className={step === i ? "selected" : ""}
                      onClick={() => setStep(i)}
                    >
                      <span>
                        <Mail size={15} />
                      </span>
                      <strong>
                        {item.title}
                        <small>{item.delay}</small>
                      </strong>
                      <ChevronRight size={14} />
                    </button>
                  ))}
                </div>
                <label>
                  Subject
                  <Input
                    value={sequence[step].subject}
                    onChange={(e) =>
                      setSequence(
                        sequence.map((s, i) =>
                          i === step ? { ...s, subject: e.target.value } : s,
                        ),
                      )
                    }
                  />
                </label>
                <label>
                  Message
                  <Textarea
                    rows={10}
                    value={sequence[step].body}
                    onChange={(e) =>
                      setSequence(
                        sequence.map((s, i) =>
                          i === step ? { ...s, body: e.target.value } : s,
                        ),
                      )
                    }
                  />
                </label>
                <p className="muted">
                  Changes save locally. Variables are shown as placeholders.
                </p>
              </div>
            )}
          </SheetContent>
        </Sheet>
        <Sheet open={compose} onOpenChange={setCompose}>
          <SheetContent className="p-6 overflow-y-auto">
            <SheetTitle>Create a campaign</SheetTitle>
            <SheetDescription>
              Start a new draft in your demo workspace.
            </SheetDescription>
            <form
              className="crm-create-form"
              onSubmit={(e) => {
                e.preventDefault();
                const data = new FormData(e.currentTarget);
                const name = String(data.get("name")).trim();
                if (!name) return;
                const campaign = {
                  id: crypto.randomUUID(),
                  name,
                  audience: String(data.get("audience")),
                  status: "Draft",
                  contacts: 0,
                  sent: 0,
                  replies: 0,
                  meetings: 0,
                  color: "blue",
                };
                setCampaigns([...campaigns, campaign]);
                setCompose(false);
                setCampaignId(campaign.id);
              }}
            >
              <label>
                Campaign name
                <Input
                  name="name"
                  required
                  maxLength={90}
                  placeholder="e.g. Product leaders in Europe"
                />
              </label>
              <label>
                Target audience
                <Input
                  name="audience"
                  required
                  maxLength={120}
                  placeholder="Who would you like to reach?"
                />
              </label>
              <p className="muted">
                New campaigns start as drafts with zero recipients.
              </p>
              <Button type="submit">
                <Plus size={15} />
                Create draft
              </Button>
            </form>
            <div className="quick-links">
              <Link href="/crm/people" onClick={() => setCompose(false)}>
                <Users size={17} />
                Browse people
              </Link>
              <Link href="/crm/tasks" onClick={() => setCompose(false)}>
                <ListTodo size={17} />
                Open my tasks
              </Link>
            </div>
          </SheetContent>
        </Sheet>
      </>
    </MotionConfig>
  );
}
