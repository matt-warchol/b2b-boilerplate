import { changelog, changelogConfig } from "@/content/changelog";
import { liveEntries, plainText, siteUrl } from "@/lib/changelog";

export const revalidate = 3600;

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function GET() {
  const base = siteUrl(changelogConfig.siteUrl);
  const items = liveEntries(changelog)
    .map((e) => {
      const link = `${base}/changelog/${e.slug}`;
      return `<item><title>${esc(e.title)}</title><link>${link}</link><guid>${link}</guid><pubDate>${new Date(`${e.date}T12:00:00Z`).toUTCString()}</pubDate>${e.tags.map((t) => `<category>${esc(t)}</category>`).join("")}<description>${esc(plainText(e.summary))}</description></item>`;
    })
    .join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${esc(changelogConfig.name)} changelog</title><link>${base}/changelog</link><description>${esc(changelogConfig.description)}</description><language>en</language>${items}</channel></rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
