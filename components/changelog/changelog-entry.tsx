import Image from "next/image";
import { Fragment } from "react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { formatEntryDate, type ChangelogEntry } from "@/lib/changelog";

// **bold** for UI labels, `code` for short technical terms and [text](/path) for links.
// Everything else is plain text, so entries never inject HTML.
function Rich({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\*\*.+?\*\*|`.+?`|\[[^\]]+\]\([^)\s]+\))/g).map((part, i) => {
        const link = part.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
        if (link && /^(\/|https:\/\/)/.test(link[2]))
          return <a key={i} href={link[2]} className="text-foreground underline underline-offset-2">{link[1]}</a>;
        if (part.startsWith("**") && part.endsWith("**"))
          return <strong key={i} className="font-medium text-foreground">{part.slice(2, -2)}</strong>;
        if (part.startsWith("`") && part.endsWith("`"))
          return <code key={i} className="rounded bg-muted px-1 py-0.5 font-mono text-[0.85em]">{part.slice(1, -1)}</code>;
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}

function List({ title, items }: { title: string; items: string[] }) {
  return (
    <section>
      <h3 className="text-sm font-medium">{title}</h3>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-muted-foreground marker:text-border">
        {items.map((item) => (
          <li key={item} className="pl-1 leading-7">
            <Rich text={item} />
          </li>
        ))}
      </ul>
    </section>
  );
}

export function ChangelogTags({ tags }: { tags: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.map((tag) => (
        <Badge key={tag} variant="secondary">{tag}</Badge>
      ))}
    </div>
  );
}

export function ChangelogDate({ date }: { date: string }) {
  return <time dateTime={date} className="text-sm font-medium">{formatEntryDate(date)}</time>;
}

// Screenshot, body, then Improvements and Fixes. Shared by the feed card and the entry page.
export function ChangelogEntryContent({ entry, className }: { entry: ChangelogEntry; className?: string }) {
  const lists = [
    entry.improvements?.length ? { title: "Improvements", items: entry.improvements } : null,
    entry.fixes?.length ? { title: "Fixes", items: entry.fixes } : null,
  ].filter((l): l is { title: string; items: string[] } => l !== null);

  return (
    <div className={cn("space-y-6", className)}>
      {entry.image && (
        <Image
          src={entry.image.src}
          alt={entry.image.alt}
          width={entry.image.width}
          height={entry.image.height}
          sizes="(min-width: 1024px) 800px, 100vw"
          className="w-full rounded-xl border bg-muted"
        />
      )}
      <div className="space-y-4 leading-7 text-muted-foreground">
        {entry.body.map((p) => (
          <p key={p}>
            <Rich text={p} />
          </p>
        ))}
      </div>
      {lists.length > 0 && (
        <>
          <Separator />
          <div className="space-y-6">
            {lists.map((l) => (
              <List key={l.title} title={l.title} items={l.items} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
