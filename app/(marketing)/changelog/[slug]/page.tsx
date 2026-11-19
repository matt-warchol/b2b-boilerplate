import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Rss } from "lucide-react";
import { Closing, MarketingFooter, MarketingHeader } from "@/components/marketing/blocks";
import { ChangelogDate, ChangelogEntryContent, ChangelogTags } from "@/components/changelog/changelog-entry";
import { CopyLinkButton } from "@/components/changelog/copy-link-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { changelog, changelogConfig } from "@/content/changelog";
import { formatEntryDate, liveEntries, plainText, siteUrl } from "@/lib/changelog";

export const revalidate = 3600;

export function generateStaticParams() {
  return liveEntries(changelog).map((e) => ({ slug: e.slug }));
}

function find(slug: string) {
  const entries = liveEntries(changelog);
  const i = entries.findIndex((e) => e.slug === slug);
  return i < 0 ? null : { entry: entries[i], older: entries[i + 1] };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const found = find((await params).slug);
  if (!found) return {};
  const { entry } = found;
  return {
    title: `${entry.title} · Changelog`,
    description: plainText(entry.summary),
    alternates: { canonical: `/changelog/${entry.slug}` },
    openGraph: {
      type: "article",
      title: entry.title,
      description: plainText(entry.summary),
      publishedTime: entry.date,
      images: entry.image ? [{ url: entry.image.src, width: entry.image.width, height: entry.image.height }] : undefined,
    },
  };
}

export default async function ChangelogEntryPage({ params }: { params: Promise<{ slug: string }> }) {
  const found = find((await params).slug);
  if (!found) notFound();
  const { entry, older } = found;
  const url = `${siteUrl(changelogConfig.siteUrl)}/changelog/${entry.slug}`;

  return (
    <>
      <MarketingHeader />
      <main id="main" tabIndex={-1}>
        <article className="mx-auto max-w-3xl px-5 py-14 sm:px-8 sm:py-20">
          <Link href="/changelog" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-4" /> Changelog
          </Link>
          <p className="mt-8 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Changelog</p>
          <h1 className="mt-3 text-balance text-4xl tracking-tight sm:text-5xl">{entry.title}</h1>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <ChangelogDate date={entry.date} />
              <ChangelogTags tags={entry.tags} />
            </div>
            <div className="flex gap-2">
              <CopyLinkButton />
              <Button asChild variant="outline" size="sm" className="rounded-full">
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Share on LinkedIn
                </a>
              </Button>
            </div>
          </div>
          <ChangelogEntryContent entry={entry} className="mt-10 text-[1.0625rem]" />
        </article>

        <section className="border-y bg-muted/45">
          <div className="mx-auto grid max-w-7xl gap-6 px-5 py-14 sm:px-8 md:grid-cols-2">
            {older ? (
              <Card className="rounded-2xl shadow-none">
                <CardHeader>
                  <CardDescription>Older entry</CardDescription>
                  <CardTitle className="text-lg">{older.title}</CardTitle>
                  <CardDescription>{formatEntryDate(older.date)}</CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button asChild variant="link" className="px-0">
                    <Link href={`/changelog/${older.slug}`}>
                      Read entry <ArrowRight />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ) : (
              <Card className="rounded-2xl shadow-none">
                <CardHeader>
                  <CardDescription>All entries</CardDescription>
                  <CardTitle className="text-lg">See everything we shipped</CardTitle>
                </CardHeader>
                <CardFooter>
                  <Button asChild variant="link" className="px-0">
                    <Link href="/changelog">
                      Open the changelog <ArrowRight />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            )}
            <Card className="rounded-2xl shadow-none">
              <CardHeader>
                <CardTitle className="text-lg">Follow the changelog</CardTitle>
                <CardDescription>New entries in your feed reader, or on LinkedIn.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                <Button asChild variant="outline" size="sm" className="rounded-full">
                  <a href="/changelog/rss.xml">
                    <Rss /> RSS feed
                  </a>
                </Button>
                <Button asChild variant="outline" size="sm" className="rounded-full">
                  <a href={changelogConfig.follow.href} target="_blank" rel="noopener noreferrer">
                    {changelogConfig.follow.label}
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
        <div className="pt-14 sm:pt-20">
          <Closing />
        </div>
      </main>
      <MarketingFooter />
    </>
  );
}
