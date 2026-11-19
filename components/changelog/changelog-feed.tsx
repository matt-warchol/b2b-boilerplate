"use client";

import Link from "next/link";
import { useState } from "react";
import { Rss } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { ChangelogEntry } from "@/lib/changelog";
import { ChangelogDate, ChangelogEntryContent, ChangelogTags } from "./changelog-entry";

type FollowLink = { label: string; href: string };

// Filter chips + subscribe links, then the dated feed (highseat.com/changelog layout).
export function ChangelogFeed({
  entries,
  tags,
  follow,
}: {
  entries: ChangelogEntry[];
  tags: readonly string[];
  follow: FollowLink;
}) {
  const [tag, setTag] = useState("all");
  const shown = tag === "all" ? entries : entries.filter((e) => e.tags.includes(tag));
  const usedTags = tags.filter((t) => entries.some((e) => e.tags.includes(t)));

  return (
    <>
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 pb-10 sm:px-8 sm:pb-14">
        <ToggleGroup
          type="single"
          value={tag}
          onValueChange={(v) => setTag(v || "all")}
          spacing={1}
          aria-label="Filter by category"
          className="flex-wrap"
        >
          {["all", ...usedTags].map((t) => (
            <ToggleGroupItem
              key={t}
              value={t}
              className="rounded-full px-3.5 data-[state=on]:bg-foreground data-[state=on]:text-background"
            >
              {t === "all" ? "All" : t}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm" className="rounded-full">
            <a href="/changelog/rss.xml">
              <Rss /> RSS feed
            </a>
          </Button>
          <Button asChild variant="outline" size="sm" className="rounded-full">
            <a href={follow.href} target="_blank" rel="noopener noreferrer">
              {follow.label}
            </a>
          </Button>
        </div>
      </div>

      <div className="border-y bg-muted/45">
        <ol className="mx-auto max-w-7xl space-y-12 px-5 py-14 sm:px-8 sm:py-20">
          {shown.map((entry) => (
            <li key={entry.slug} className="grid gap-4 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-12">
              <div className="flex items-center gap-3 lg:sticky lg:top-8 lg:flex-col lg:items-start lg:self-start">
                <ChangelogDate date={entry.date} />
                <ChangelogTags tags={entry.tags} />
              </div>
              <Card className="gap-0 rounded-2xl p-6 shadow-none sm:p-10">
                <h2 className="text-2xl tracking-tight sm:text-3xl">
                  <Link href={`/changelog/${entry.slug}`} className="hover:underline">
                    {entry.title}
                  </Link>
                </h2>
                <ChangelogEntryContent entry={entry} className="mt-6" />
              </Card>
            </li>
          ))}
        </ol>
      </div>
    </>
  );
}
