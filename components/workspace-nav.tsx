"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, FileText, Rows3 } from "lucide-react";
import { Brand } from "./brand";

const links = [
  { href: "/workspace", label: "Opportunities", icon: Rows3 },
  { href: "/workspace/briefs", label: "Bid briefs", icon: FileText },
] as const;

export function WorkspaceNav() {
  const pathname = usePathname();
  return <aside className="sidebar">
    <Brand />
    <nav aria-label="Workspace" className="side-nav">
      {links.map(({ href, label, icon: Icon }) =>
        <Link key={href} href={href} aria-current={pathname === href ? "page" : undefined}>
          <Icon aria-hidden="true" />{label}
        </Link>)}
    </nav>
    <div className="sidebar-foot">
      <Link href="/"><ArrowLeft aria-hidden="true" /> Back to overview</Link>
    </div>
  </aside>;
}
