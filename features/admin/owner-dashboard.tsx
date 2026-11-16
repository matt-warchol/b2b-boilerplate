"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import {
  ArrowUpRight,
  Building2,
  CreditCard,
  LayoutDashboard,
  Plus,
  Search,
  Timer,
  TriangleAlert,
} from "lucide-react";
import { FolidockMark } from "@/components/brand";
import { SiteHeader } from "@/features/crm/dashboard-shell";
import { SectionCards } from "@/features/crm/section-cards";
import { useSaved } from "@/lib/use-demo-storage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CustomerForm } from "./customer-form";
import {
  currency,
  isCustomerPlan,
  plans,
  sampleCustomers,
  statuses,
  type Customer,
} from "./customers";

const dateFormat = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeZone: "UTC",
});
const tones: Record<Customer["status"], string> = {
  Active: "green",
  Trial: "violet",
  "Past due": "",
  Paused: "gray",
  Canceled: "gray",
};

function OwnerSidebar() {
  const { setOpenMobile } = useSidebar();
  const links = [
    { id: "#summary", label: "Overview", icon: LayoutDashboard },
    { id: "#customers", label: "Customers", icon: Building2 },
  ];
  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg">
              <Link href="/admin" onClick={() => setOpenMobile(false)}>
                <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground">
                  <span className="size-6"><FolidockMark /></span>
                </span>
                <span className="grid flex-1 leading-tight">
                  <strong className="text-base">Folidock</strong>
                  <span className="text-sm text-muted-foreground">
                    Owner workspace
                  </span>
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {links.map(({ id, label, icon: Icon }) => (
              <SidebarMenuItem key={id}>
                <SidebarMenuButton asChild className="h-9">
                  <a href={id} onClick={() => setOpenMobile(false)}>
                    <Icon />
                    {label}
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/crm/overview">
                <ArrowUpRight />
                Open CRM demo
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

export function OwnerDashboard() {
  const [customers, setCustomers, storageError] = useSaved(
    "folio.owner.customers.v1",
    sampleCustomers,
  );
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All statuses");
  const [editor, setEditor] = useState<Customer | "new" | undefined>();
  const [announcement, setAnnouncement] = useState("");
  const trigger = useRef<HTMLButtonElement | null>(null);
  const createButton = useRef<HTMLButtonElement>(null);
  const active = customers.filter((c) => c.status === "Active");
  const filtered = customers.filter(
    (c) =>
      (status === "All statuses" || c.status === status) &&
      (c.company + " " + c.email)
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );
  const metrics = [
    {
      label: "Customer accounts",
      value: String(customers.length),
      icon: Building2,
      context: active.length + " active",
    },
    {
      label: "Sample MRR",
      value: currency.format(
        active.reduce(
          (sum, c) => sum + (isCustomerPlan(c.plan) ? plans[c.plan] : 0),
          0,
        ),
      ),
      icon: CreditCard,
      context: "Active plans only",
    },
    {
      label: "Trials",
      value: String(customers.filter((c) => c.status === "Trial").length),
      icon: Timer,
      context: "Accounts evaluating Folidock",
    },
    {
      label: "Past due",
      value: String(customers.filter((c) => c.status === "Past due").length),
      icon: TriangleAlert,
      context: "Billing follow-ups",
    },
  ];
  function save(customer: Customer) {
    setCustomers(
      editor === "new"
        ? [customer, ...customers]
        : customers.map((c) => (c.id === customer.id ? customer : c)),
    );
    setEditor(undefined);
    setAnnouncement(customer.company + " saved.");
  }
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
      <a href="#owner-main" className="skip-link">
        Skip to owner panel
      </a>
      <OwnerSidebar />
      <SidebarInset id="owner-main" className="min-w-0" tabIndex={-1}>
        <SiteHeader title="Accounts" scope="Owner workspace" />
        <div className="crm-main grid gap-6">
          <section id="summary" className="grid gap-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl tracking-tight sm:text-4xl">
                  Customer accounts
                </h1>
                <p className="mt-2 text-muted-foreground">
                  Review subscriptions, seats, and account status from one
                  place.
                </p>
              </div>
              <Button
                ref={createButton}
                onClick={(e) => {
                  trigger.current = e.currentTarget;
                  setEditor("new");
                }}
              >
                <Plus />
                Add customer
              </Button>
            </div>
            <p className="rounded-lg border bg-muted px-4 py-3 text-sm text-muted-foreground">
              Owner demo with fictional accounts. Changes stay in this browser.
              Billing is simulated.
            </p>
            <SectionCards metrics={metrics} />
          </section>
          <Card id="customers">
            <CardHeader>
              <CardTitle>
                <h2 className="text-lg">Customer directory</h2>
              </CardTitle>
              <CardDescription>
                Open an account to edit its plan, status, seats, or internal
                notes.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <label className="flex w-full max-w-xs items-center gap-2">
                  <Search
                    aria-hidden="true"
                    className="size-4 shrink-0 text-muted-foreground"
                  />
                  <Input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    aria-label="Search customers"
                    placeholder="Search name or email…"
                  />
                </label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">{status}</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuRadioGroup
                      value={status}
                      onValueChange={setStatus}
                    >
                      {["All statuses", ...statuses].map((value) => (
                        <DropdownMenuRadioItem key={value} value={value}>
                          {value}
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
                <span
                  aria-live="polite"
                  className="text-sm text-muted-foreground"
                >
                  {filtered.length} accounts
                </span>
              </div>
              <div className="min-w-0 rounded-lg border">
                <Table className="crm-table">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Seats</TableHead>
                      <TableHead>Customer since</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((c) => (
                      <TableRow key={c.id}>
                        <TableCell>
                          <Button
                            type="button"
                            variant="ghost"
                            className="crm-person h-auto justify-start rounded-sm px-2 py-1.5 whitespace-normal"
                            onClick={(e) => {
                              trigger.current = e.currentTarget;
                              setEditor(c);
                            }}
                          >
                            <span className="grid size-8 shrink-0 place-items-center rounded-md bg-muted">
                              <Building2
                                aria-hidden="true"
                                className="size-4"
                              />
                            </span>
                            <span>
                              <strong>{c.company}</strong>
                              <small>{c.email}</small>
                            </span>
                          </Button>
                        </TableCell>
                        <TableCell>{c.plan}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              c.status === "Past due"
                                ? "destructive"
                                : "secondary"
                            }
                            className={"crm-badge " + (tones[c.status] ?? "")}
                          >
                            {c.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">{c.seats}</TableCell>
                        <TableCell>
                          {/^\d{4}-\d{2}-\d{2}$/.test(c.since) &&
                          Number.isFinite(Date.parse(c.since))
                            ? dateFormat.format(new Date(c.since))
                            : "—"}
                        </TableCell>
                      </TableRow>
                    ))}
                    {!filtered.length && (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="py-8 text-center text-muted-foreground"
                        >
                          No accounts match your filters.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
          <p role="status" className="text-sm text-muted-foreground">
            {storageError || announcement}
          </p>
        </div>
      </SidebarInset>
      <Sheet
        open={editor !== undefined}
        onOpenChange={(open) => {
          if (!open) setEditor(undefined);
        }}
      >
        <SheetContent
          className="w-full overflow-y-auto sm:max-w-lg"
          onCloseAutoFocus={(e) => {
            e.preventDefault();
            (trigger.current?.isConnected
              ? trigger.current
              : createButton.current
            )?.focus();
          }}
        >
          {editor && (
            <>
              <SheetHeader>
                <SheetTitle>
                  {editor === "new" ? "Add customer" : editor.company}
                </SheetTitle>
                <SheetDescription>
                  Save account details in this demo browser. No billing changes
                  are made.
                </SheetDescription>
              </SheetHeader>
              <CustomerForm
                key={editor === "new" ? "new" : editor.id}
                customer={editor === "new" ? undefined : editor}
                onSave={save}
              />
            </>
          )}
        </SheetContent>
      </Sheet>
    </SidebarProvider>
  );
}
