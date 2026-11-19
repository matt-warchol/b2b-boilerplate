// Public changelog: one entry per shipped feature or notable improvement (not per small fix).
// Entries live in content/changelog.ts. An entry goes live on its date, so a scheduled entry
// can sit in the repo and appear without a deploy (pages revalidate hourly).
// Layout follows highseat.com/changelog: date and tags on the left, entry card on the right,
// optional screenshot, body, then "Improvements" and "Fixes" lists. See docs/CHANGELOG-POSTS.md.

export type ChangelogImage = { src: string; alt: string; width: number; height: number };

export type ChangelogEntry = {
  slug: string; // URL: /changelog/<slug>
  date: string; // YYYY-MM-DD, the day it shipped (and goes live)
  title: string; // what the user can now do, e.g. "Invite your team"
  tags: string[]; // one or two from changelogTags
  summary: string; // one sentence for RSS, link previews and search
  image?: ChangelogImage;
  body: string[]; // paragraphs; **bold** for UI labels, [text](/path) for links
  improvements?: string[];
  fixes?: string[];
};

export function siteUrl(fallback: string) {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? fallback).replace(/\/$/, "");
}

// Newest first. Entries with the same date keep their order in the file (put the newest on top).
export function liveEntries(entries: ChangelogEntry[], now: Date = new Date()) {
  const today = now.toISOString().slice(0, 10);
  return entries.filter((e) => e.date <= today).sort((a, b) => b.date.localeCompare(a.date));
}

export function formatEntryDate(date: string) {
  return new Date(`${date}T12:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

// Plain text for RSS and metadata (drops **bold**, `code` and [link](url) markup).
export function plainText(text: string) {
  return text
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/`(.+?)`/g, "$1")
    .replace(/\[([^\]]+)\]\([^)\s]+\)/g, "$1");
}
