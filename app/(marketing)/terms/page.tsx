import type { Metadata } from "next";
import { LegalPage } from "@/components/marketing/legal-page";
import { terms } from "@/content/legal";

export const metadata: Metadata = { title: "Terms of service · Folidock", description: terms.intro };

export default function TermsPage() {
  return <LegalPage doc={terms} />;
}
