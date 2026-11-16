import type { Metadata } from "next";
import "@fontsource-variable/geist";
import "../crm/crm.css";
import { OwnerDashboard } from "@/features/admin/owner-dashboard";

export const metadata: Metadata = {
  title: "SaaS owner demo",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <OwnerDashboard />;
}
