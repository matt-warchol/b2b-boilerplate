import type { Metadata } from "next";
import { Closing, MarketingFooter, MarketingHeader } from "@/components/marketing/blocks";
import { ChangelogFeed } from "@/components/changelog/changelog-feed";
import { Badge } from "@/components/ui/badge";
import { changelog, changelogConfig, changelogTags } from "@/content/changelog";
import { liveEntries } from "@/lib/changelog";

// Entries go live on their date; rebuild hourly so scheduled ones appear on time.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Changelog",
  description: changelogConfig.description,
  alternates: {
    canonical: "/changelog",
    types: { "application/rss+xml": "/changelog/rss.xml" },
  },
};

export default function ChangelogPage() {
  const entries = liveEntries(changelog);
  return (
    <>
      <MarketingHeader />
      <main id="main" tabIndex={-1}>
        <section className="mx-auto max-w-7xl px-5 pt-14 pb-10 sm:px-8 sm:pt-20">
          <Badge variant="outline" className="rounded-full px-2.5 py-1">Changelog</Badge>
          <h1 className="mt-5 text-balance text-4xl leading-[1.05] tracking-tight md:text-5xl">
            What shipped, and when.
            <span className="block text-muted-foreground">Every change, dated.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">{changelogConfig.description}</p>
        </section>
        <ChangelogFeed entries={entries} tags={changelogTags} follow={changelogConfig.follow} />
        <div className="pt-14 sm:pt-20">
          <Closing />
        </div>
      </main>
      <MarketingFooter />
    </>
  );
}
