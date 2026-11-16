import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Brand } from "@/components/brand";
import { buttonVariants } from "@/components/ui/button";
import { site } from "@/content/site";
import { FolioNav, FolioProductTour, FolioFAQ } from "@/components/folio-landing";


function PrimaryAction({ inverse = false }: { inverse?: boolean }) {
  return (
    <Link
      href={site.primaryAction.href}
      className={buttonVariants({ variant: inverse ? "secondary" : "default", size: "lg" })}
    >
      {site.primaryAction.label}
      <ArrowUpRight aria-hidden="true" />
    </Link>
  );
}

export default function LandingPage() {
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <header className="site-header">
        <div className="container site-bar folio-site-bar">
          <Brand />
          <FolioNav />
          <Link
            className={buttonVariants({ variant: "outline" })}
            href={site.primaryAction.href}
          >
            {site.primaryAction.label}
            <ArrowUpRight aria-hidden="true" />
          </Link>
        </div>
      </header>
      <main id="main" tabIndex={-1}>
        <section className="hero" aria-labelledby="hero-title">
          <div className="container">
            <div className="intro-copy">
              <h1 id="hero-title">A CRM for the work before and after hello.</h1>
              <p>Find the right people, run outbound sequences, and pick up every reply where the relationship lives.</p>
              <div className="hero-actions">
                <PrimaryAction />
                <Link
                  className={buttonVariants({ variant: "outline" })}
                  href="/crm/overview"
                >
                  See CRM overview
                  <ArrowUpRight aria-hidden="true" />
                </Link>
              </div>
            </div>
            <figure className="hero-preview">
              <div className="preview-stage">
                <Link
                  className="preview-link"
                  href="/crm/overview"
                  aria-label="Open the Folio CRM overview"
                >
                  <picture>
                    <source
                      media="(max-width: 600px)"
                      srcSet="/crm-preview-mobile.webp"
                      width={390}
                      height={844}
                    />
                    <Image
                      src="/crm-preview.webp"
                      width={1512}
                      height={1100}
                      loading="eager"
                      fetchPriority="high"
                      unoptimized
                      alt="Folio CRM overview with campaign analytics and sample contacts."
                    />
                  </picture>
                </Link>
              </div>
              <figcaption>
                The Folio workspace, shown with sample data.
              </figcaption>
            </figure>
          </div>
        </section>
        <FolioProductTour />
        <section className="faq-band" id="faq" aria-labelledby="faq-title">
          <div className="container faq-grid">
            <h2 id="faq-title">Before you try it.</h2>
            <FolioFAQ />
          </div>
        </section>
        <section className="closing" aria-labelledby="closing-title">
          <div className="container closing-inner">
            <h2 id="closing-title">Make room for your next conversation.</h2>
            <PrimaryAction inverse />
          </div>
        </section>
      </main>
      <footer className="site-footer">
        <div className="container footer-inner">
          <Brand />
          <p>An open-source B2B starter demo.</p>
          <a href="https://github.com/matt-warchol/b2b-boilerplate">
            Source on GitHub
            <ArrowUpRight aria-hidden="true" />
          </a>
        </div>
      </footer>
    </>
  );
}
