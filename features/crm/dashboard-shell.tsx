"use client";

// shadcn/ui dashboard-01: app-sidebar, nav-main, nav-user and site-header,
// adapted to Folidock's routes and the existing Lucide icon set.
import Link from "next/link";
import {
  ArrowUpRight,
  Building2,
  ChartNoAxesCombined,
  CheckCheck,
  ChevronsUpDown,
  Columns3,
  FileText,
  Inbox,
  LayoutDashboard,
  PlusCircle,
  Send,
  Settings2,
  Users,
} from "lucide-react";
import { FolidockMark } from "@/components/brand";
import { ThemePicker } from "@/components/theme-picker";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { RecordAvatar } from "./record-avatar";

const groups = [
  {
    title: "Workspace",
    items: [
      ["overview", "Overview", LayoutDashboard],
      ["inbox", "Inbox", Inbox],
      ["tasks", "My tasks", CheckCheck],
    ],
  },
  {
    title: "Relationships",
    items: [
      ["people", "People", Users],
      ["companies", "Companies", Building2],
      ["pipeline", "Pipeline", Columns3],
    ],
  },
  {
    title: "Outbound",
    items: [
      ["campaigns", "Campaigns", Send],
      ["templates", "Templates", FileText],
      ["analytics", "Analytics", ChartNoAxesCombined],
    ],
  },
] as const;

const demoUser = "Alex Morgan";
const sourceUrl = "https://github.com/matt-warchol/b2b-boilerplate";

export function AppSidebar({
  view,
  workspace,
  taskCount,
  inboxCount,
  onCreate,
}: {
  view: string;
  workspace: string;
  taskCount: number;
  inboxCount: number;
  onCreate: () => void;
}) {
  const { isMobile, setOpenMobile } = useSidebar();
  const closeMobile = () => setOpenMobile(false);
  return (
    <Sidebar collapsible="offcanvas" variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg">
              <Link href="/crm/overview" onClick={closeMobile}>
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground [&_svg]:size-6">
                  <FolidockMark />
                </span>
                <span className="grid min-w-0 flex-1 text-left leading-tight">
                  <span className="truncate text-base font-semibold">
                    Folidock
                  </span>
                  <span className="truncate text-sm text-muted-foreground">
                    {workspace}
                  </span>
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem className="flex items-center gap-2">
                <SidebarMenuButton
                  tooltip="New campaign"
                  className="h-9 bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                  onClick={() => {
                    closeMobile();
                    onCreate();
                  }}
                >
                  <PlusCircle /> <span>New campaign</span>
                </SidebarMenuButton>
                <Button
                  size="icon"
                  variant="outline"
                  className="size-9 shrink-0"
                  asChild
                >
                  <Link
                    href="/crm/inbox"
                    aria-label="Open inbox"
                    onClick={closeMobile}
                  >
                    <Inbox />
                  </Link>
                </Button>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {groups.map(({ title, items }) => (
          <SidebarGroup key={title}>
            <SidebarGroupLabel className="text-xs">{title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map(([route, label, Icon]) => (
                  <SidebarMenuItem key={route}>
                    <SidebarMenuButton
                      asChild
                      tooltip={label}
                      isActive={route === view}
                      className="h-9 text-sm"
                    >
                      <Link
                        href={"/crm/" + route}
                        aria-current={view === route ? "page" : undefined}
                        onClick={closeMobile}
                      >
                        <Icon />
                        <span>{label}</span>
                      </Link>
                    </SidebarMenuButton>
                    {route === "inbox" && (
                      <SidebarMenuBadge>{inboxCount}</SidebarMenuBadge>
                    )}
                    {route === "tasks" && (
                      <SidebarMenuBadge>{taskCount}</SidebarMenuBadge>
                    )}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={view === "settings"}
                  tooltip="Settings"
                  className="h-9"
                >
                  <Link
                    href="/crm/settings"
                    aria-current={view === "settings" ? "page" : undefined}
                    onClick={closeMobile}
                  >
                    <Settings2 />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent"
                >
                  <RecordAvatar name={demoUser} className="size-8 rounded-lg" />
                  <span className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{demoUser}</span>
                    <span className="truncate text-xs text-muted-foreground">
                      Demo workspace
                    </span>
                  </span>
                  <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="min-w-56"
                side={isMobile ? "top" : "right"}
                align="end"
              >
                <DropdownMenuItem asChild>
                  <Link href="/crm/settings" onClick={closeMobile}>
                    <Settings2 />
                    Workspace settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href={sourceUrl}>
                    <ArrowUpRight />
                    View source
                  </a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

export function SiteHeader({
  title,
  scope = "Workspace",
}: {
  title: string;
  scope?: string;
}) {
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" aria-label="Toggle navigation" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden sm:inline-flex">
              {scope}
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden sm:block" />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-medium">{title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="ml-auto flex shrink-0 items-center gap-2">
          <Badge variant="secondary" className="hidden sm:inline-flex">Demo workspace</Badge>
          <ThemePicker />
        </div>
      </div>
    </header>
  );
}
