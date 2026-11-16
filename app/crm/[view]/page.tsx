import { notFound } from "next/navigation";
import { CRM } from "@/features/crm/crm";

export const dynamicParams = false;
const views = [
  "overview",
  "people",
  "companies",
  "pipeline",
  "campaigns",
  "inbox",
  "tasks",
  "templates",
  "analytics",
  "settings",
];
export function generateStaticParams() {
  return views.map((view) => ({ view }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ view: string }>;
}) {
  const { view } = await params;
  return {
    title: view.charAt(0).toUpperCase() + view.slice(1) + " · CRM",
    robots: { index: false },
  };
}
export default async function Page({
  params,
}: {
  params: Promise<{ view: string }>;
}) {
  const { view } = await params;
  if (!views.includes(view)) notFound();
  return <CRM view={view} />;
}
