import { LockKeyhole } from "lucide-react";
import { FeedbackWidget } from "@/components/feedback/feedback-widget";
import { WorkspaceNav } from "@/components/workspace-nav";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export const metadata = { robots: { index: false, follow: false } };

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  return <SidebarProvider className="workspace-app">
    <a className="skip-link" href="#workspace-main">Skip to workspace</a>
    <WorkspaceNav />
    <SidebarInset className="min-w-0">
      <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4 lg:px-6">
        <SidebarTrigger className="-ml-1" aria-label="Toggle navigation" />
        <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
        <span className="text-sm font-medium">Bid workspace</span>
        <Badge variant="secondary" className="ml-auto"><LockKeyhole aria-hidden="true" /> Local demo</Badge>
      </header>
      <main className="workspace-main" id="workspace-main" tabIndex={-1}>{children}</main>
    </SidebarInset>
    <FeedbackWidget />
  </SidebarProvider>;
}
