import type { Metadata } from "next";
import "@fontsource-variable/manrope";
import "./globals.css";
import "./workspace.css";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: { default: site.title, template: "%s | " + site.name },
  description: site.description,
  openGraph: { title: site.title, description: site.description, type: "website" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" data-theme={site.theme}><body>{children}</body></html>;
}
