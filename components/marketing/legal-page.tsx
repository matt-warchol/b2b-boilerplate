import { MarketingFooter, MarketingHeader } from "@/components/marketing/blocks";
import type { LegalDoc } from "@/content/legal";

// Privacy policy and terms: plain prose sections from content/legal.ts.
export function LegalPage({ doc }: { doc: LegalDoc }) {
  return (
    <>
      <MarketingHeader />
      <main id="main" tabIndex={-1} className="mx-auto max-w-3xl px-5 py-14 sm:px-8">
        <h1 className="text-4xl tracking-tight">{doc.title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated {doc.updated}</p>
        <p className="mt-6 text-lg text-muted-foreground">{doc.intro}</p>
        <div className="mt-10 space-y-9">
          {doc.sections.map((s) => (
            <section key={s.heading} className="space-y-3">
              <h2 className="text-xl font-semibold tracking-tight">{s.heading}</h2>
              {s.body.map((p, i) => (
                <p key={i} className="leading-7 text-muted-foreground">
                  {p}
                </p>
              ))}
              {s.list && (
                <ul className="list-disc space-y-1.5 pl-5 leading-7 text-muted-foreground">
                  {s.list.map((li) => (
                    <li key={li}>{li}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      </main>
      <MarketingFooter />
    </>
  );
}
