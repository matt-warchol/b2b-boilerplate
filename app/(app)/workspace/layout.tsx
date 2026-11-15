import { LockKeyhole } from "lucide-react";
import { WorkspaceNav } from "@/components/workspace-nav";

export const metadata = { robots: { index: false, follow: false } };

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  return <div className="workspace">
    <a className="skip-link" href="#workspace-main">Skip to workspace</a>
    <WorkspaceNav />
    <div className="workspace-body">
      <div className="workspace-bar">
        <span>Bid workspace</span>
        <span className="workspace-demo"><LockKeyhole aria-hidden="true" /> Local demo</span>
      </div>
      <main className="workspace-main" id="workspace-main" tabIndex={-1}>{children}</main>
    </div>
  </div>;
}
