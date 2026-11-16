import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown,
  ArrowUpRight,
  ListFilter,
  FileText,
  SquarePen,
} from "lucide-react";
import { Brand } from "@/components/brand";
import { buttonVariants } from "@/components/ui/button";
import { site } from "@/content/site";

const icons = [ListFilter, SquarePen, FileText];

function PrimaryAction({ inverse = false }: { inverse?: boolean }) {
  return (
    <Link
      href={site.primaryAction.href}
      className={buttonVariants({ variant: inverse ? "inverse" : "default" })}
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
        <div className="container site-bar">
          <Brand />
          <nav className="site-nav" aria-label="Sections">
            <a href="#workflow">Workflow</a>
            <a href="#faq">FAQ</a>
          </nav>
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
              <h1 id="hero-title">{site.hero.headline}</h1>
              <p>{site.hero.description}</p>
              <div className="hero-actions">
                <PrimaryAction />
                <a
                  className={buttonVariants({ variant: "outline" })}
                  href="#workflow"
                >
                  See the workflow
                  <ArrowDown aria-hidden="true" />
                </a>
              </div>
            </div>
            <figure className="hero-preview">
              <div className="preview-stage">
                <Link
                  className="preview-link"
                  href={site.primaryAction.href}
                  aria-label="Open the Folio CRM demo"
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
        <section
          className="workflow container"
          id="workflow"
          aria-labelledby="workflow-title"
        >
          <div className="section-intro">
            <h2 id="workflow-title">
              Every relationship. One shared workspace.
            </h2>
          </div>
          <ol className="workflow-list">
            {site.workflow.map(({ title, description }, index) => {
              const Icon = icons[index];
              return (
                <li key={title}>
                  <div className="workflow-icon">
                    <Icon aria-hidden="true" />
                  </div>
                  <div>
                    <h3>{title}</h3>
                    <p>{description}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>
        <section className="faq-band" id="faq" aria-labelledby="faq-title">
          <div className="container faq-grid">
            <h2 id="faq-title">Before you try it.</h2>
            <div className="faq-list">
              {site.faq.map(({ question, answer }) => (
                <details key={question}>
                  <summary>{question}</summary>
                  <p>{answer}</p>
                </details>
              ))}
            </div>
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
