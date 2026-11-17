import type { Metadata } from "next";
import Script from "next/script";
import "@fontsource-variable/manrope";
import "@fontsource-variable/geist";
import "./globals.css";
import "./workspace.css";
import "./themes.css";
import { FeedbackWidget } from "@/components/feedback/feedback-widget";
import { site } from "@/content/site";
import { themes, themeStorageKey } from "@/content/themes";

export const metadata: Metadata = {
  title: { default: site.title, template: "%s | " + site.name },
  description: site.description,
  openGraph: { title: site.title, description: site.description, type: "website" },
};

// Apply shared previews and saved preferences before hydration without making routes dynamic.
const themeScript = `(() => {
  const themes = ${JSON.stringify(themes.map(({ id }) => id))};
  const key = ${JSON.stringify(themeStorageKey)};
  function applyTheme() {
    const preview = new URLSearchParams(location.search).get("theme");
    let theme = preview;
    try {
      if (themes.includes(preview)) localStorage.setItem(key, preview);
      else theme = localStorage.getItem(key);
    } catch {}
    if (themes.includes(theme)) document.documentElement.dataset.theme = theme;
  }
  applyTheme();
  addEventListener("popstate", applyTheme);
})();`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme={site.theme} suppressHydrationWarning>
      <body>
        <Script id="folidock-theme" strategy="beforeInteractive">{themeScript}</Script>
        {children}
        <FeedbackWidget />
      </body>
    </html>
  );
}
