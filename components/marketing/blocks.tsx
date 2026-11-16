// Layouts adapted from the Tailark OSS Dusk and Mist blocks listed in docs/UI-AUDIT.md.
import Image from "next/image";
import Link from "next/link";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Building2,
  Check,
  GitBranch,
  Shield,
  Workflow,
} from "lucide-react";
import { Brand } from "@/components/brand";
import { FolioFAQ, FolioNav } from "@/components/folio-landing";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { site } from "@/content/site";
import { Reveal } from "./reveal";

const source = "https://github.com/matt-warchol/b2b-boilerplate";
const pageWidth = "mx-auto max-w-7xl px-5 sm:px-8";
const blockSpace = "py-14 sm:py-20";
const titleStyle =
  "text-balance text-4xl leading-[1.05] tracking-tight md:text-5xl";

function CampaignButton() {
  return (
    <Button size="lg" asChild className="h-11 rounded-full px-5">
      <Link href={site.primaryAction.href}>
        {site.primaryAction.label}
        <ArrowUpRight />
      </Link>
    </Button>
  );
}

export function MarketingHeader() {
  return (
    <header className="border-b bg-background/95">
      <div className={`${pageWidth} flex min-h-17 items-center gap-4 sm:gap-8`}>
        <Brand />
        <FolioNav />
        <Button
          asChild
          variant="outline"
          className="ml-auto hidden rounded-full sm:inline-flex"
        >
          <Link href={site.primaryAction.href}>
            {site.primaryAction.label} <ArrowUpRight />
          </Link>
        </Button>
      </div>
    </header>
  );
}

// Tailark dusk-hero-section-2: split introduction above a framed, full-width product shot.
export function ProductHero() {
  return (
    <section
      className={`${pageWidth} pt-16 sm:pt-22 lg:pt-25`}
      aria-labelledby="hero-title"
    >
      <div className="flex justify-between gap-6 max-md:flex-col md:items-end">
        <Reveal eager>
          <Button
            asChild
            variant="secondary"
            size="sm"
            className="mb-6 w-fit rounded-full"
          >
            <Link href={source}>
              <GitBranch />
              Open-source B2B starter
            </Link>
          </Button>
          <h1
            id="hero-title"
            className="max-w-4xl text-balance text-[clamp(3.15rem,7vw,6.8rem)] leading-[.96] tracking-[-.07em]"
          >
            From first touch
            <br className="hidden lg:block" /> to next deal.
          </h1>
        </Reveal>
        <Reveal
          eager
          delay={0.1}
          className="space-y-5 md:max-w-[20rem] md:pb-1 lg:max-w-[23rem]"
        >
          <p className="text-pretty text-lg leading-relaxed text-muted-foreground">
            Find the right contacts, draft outbound sequences, and keep replies
            and deals in one workspace.
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <CampaignButton />
            <Button variant="ghost" size="lg" asChild className="rounded-full">
              <Link href="/crm/overview">
                See CRM overview
                <ArrowDownRight />
              </Link>
            </Button>
          </div>
        </Reveal>
      </div>
      <Reveal eager delay={0.18} className="mt-9 sm:mt-12">
        <div className="overflow-hidden rounded-[1.4rem] bg-[#192746] bg-[radial-gradient(ellipse_at_15%_10%,#6d85d4_0%,transparent_54%),radial-gradient(ellipse_at_82%_15%,#3e55a1_0%,transparent_47%)] p-2.5 sm:rounded-[2rem] sm:p-5 lg:p-8">
          <Link
            href="/crm/overview"
            className="block overflow-hidden rounded-xl bg-background ring-1 ring-white/30 shadow-2xl transition-[filter] hover:brightness-[1.025] sm:rounded-[1.25rem]"
            aria-label="Open the Folidock CRM overview"
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
                sizes="(max-width: 600px) 90vw, (max-width: 1280px) 92vw, 1170px"
                className="h-auto w-full"
                preload
                unoptimized
                alt="Folidock CRM overview showing campaign performance, contacts, and sample activity."
              />
            </picture>
          </Link>
        </div>
      </Reveal>
    </section>
  );
}

// Tailark dusk-content-2: editorial split with supporting points.
export function ProductStory() {
  return (
    <section className={`${pageWidth} ${blockSpace}`}>
      <Reveal className="grid gap-5 md:grid-cols-2 lg:gap-12">
        <h2 className={`${titleStyle} max-w-xl`}>
          Your outreach has a history. Keep it with the account.
        </h2>
        <div className="space-y-6">
          <p className="text-pretty text-lg leading-relaxed text-muted-foreground">
            See which companies you’re talking to, what you sent, and what to do
            next. Then use the pipeline to hand off the deal.
          </p>
          <div className="grid gap-4 border-t pt-5 sm:grid-cols-2">
            <p className="text-muted-foreground">
              <Building2 className="mb-2 size-5 text-foreground" />
              <strong className="block text-foreground">Work by account</strong>
              Find the company and the people involved.
            </p>
            <p className="text-muted-foreground">
              <Workflow className="mb-2 size-5 text-foreground" />
              <strong className="block text-foreground">
                Work the next step
              </strong>
              Track a reply, draft a follow-up or move a deal.
            </p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

const featureCards = [
  {
    title: "See every open deal.",
    description:
      "Move opportunities between stages and keep the owner visible.",
    url: "/crm/pipeline",
    image: "/marketing-pipeline.webp",
    name: "Deal pipeline",
  },
  {
    title: "Give every reply a next step.",
    description: "Read the conversation and save your answer as a draft.",
    url: "/crm/inbox",
    image: "/marketing-inbox.webp",
    name: "Shared inbox",
  },
  {
    title: "Know which accounts need you.",
    description:
      "Review subscriptions, seats, and notes across customer workspaces.",
    url: "/admin",
    image: "/marketing-admin.webp",
    name: "Owner workspace",
  },
];

// Tailark dusk-features-2: three visual feature cards. The artwork is captured from Folidock.
export function ProductFeatures() {
  return (
    <section id="features" className={`${blockSpace} border-y bg-muted/50`}>
      <div className={pageWidth}>
        <Reveal>
          <h2 className={titleStyle}>
            One workspace.
            <br />
            <span className="text-muted-foreground">
              Three views of the relationship.
            </span>
          </h2>
        </Reveal>
        <div className="mt-9 grid gap-4 lg:grid-cols-3">
          {featureCards.map((item, i) => (
            <Reveal key={item.url} delay={i * 0.07} className="h-full">
              <Card className="group h-full overflow-hidden gap-0 pb-0 shadow-xs">
                <CardHeader className="min-h-29">
                  <CardTitle className="text-xl leading-tight">
                    {item.title}
                  </CardTitle>
                  <CardDescription className="text-base">
                    {item.description}
                  </CardDescription>
                  <Link
                    href={item.url}
                    className="mt-2 inline-flex w-fit items-center gap-2 text-sm font-semibold hover:underline"
                  >
                    {item.name}
                    <ArrowUpRight className="size-4" />
                  </Link>
                </CardHeader>
                <div className="mt-5 aspect-16/10 overflow-hidden border-t bg-muted p-3 pb-0">
                  <Image
                    src={item.image}
                    width={860}
                    height={540}
                    sizes="(max-width: 1024px) 90vw, 380px"
                    unoptimized
                    className="size-full rounded-t-lg border object-cover object-top shadow-sm transition-transform duration-500 motion-safe:group-hover:scale-[1.035]"
                    alt={item.name + " in Folidock"}
                  />
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

const choices = [
  {
    label: "Explore the product",
    detail: "Browser demo",
    description: "Try the full workflow with sample data.",
    items: [
      "CRM and pipeline",
      "Outbound sequences and inbox",
      "Owner workspace",
    ],
    href: site.primaryAction.href,
    cta: site.primaryAction.label,
  },
  {
    label: "Start with the code",
    detail: "MIT license",
    description: "Use the template for your own B2B product.",
    items: [
      "Next.js and shadcn/ui",
      "Reusable CRM and owner sections",
      "Local demo data",
    ],
    href: source + "/generate",
    cta: "Use the GitHub template",
  },
];

// Tailark mist-pricing-2: comparison card. The options describe demo access and the source, with no paid plans.
export function DemoOptions() {
  return (
    <section id="get-started" className={`${blockSpace} border-y bg-muted/55`}>
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className={titleStyle}>Try it or make it yours.</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Open Folidock in the browser, or start your next SaaS from the
              source.
            </p>
          </div>
        </Reveal>
        <Reveal className="mt-10">
          <Card className="mx-auto max-w-lg py-0 md:max-w-full">
            <div className="grid md:grid-cols-2">
              {choices.map((choice, i) => (
                <div
                  key={choice.label}
                  className={
                    i === 1 ? "border-t md:border-t-0 md:border-l" : undefined
                  }
                >
                  <CardHeader className="p-6 sm:p-8">
                    <CardTitle className="text-sm">{choice.label}</CardTitle>
                    <span className="mt-1 block text-2xl font-semibold tracking-tight">
                      {choice.detail}
                    </span>
                    <CardDescription>{choice.description}</CardDescription>
                  </CardHeader>
                  <div className="border-y px-6 py-4 sm:px-8">
                    <Button
                      asChild
                      className="w-full"
                      variant={i === 0 ? "default" : "outline"}
                    >
                      <Link href={choice.href}>
                        {choice.cta}
                        <ArrowUpRight />
                      </Link>
                    </Button>
                  </div>
                  <ul className="grid gap-3 p-6 text-sm sm:p-8">
                    {choice.items.map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <Check className="size-4 text-[#5267bc]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Card>
        </Reveal>
      </div>
    </section>
  );
}

// Tailark dusk-faqs-1 and dusk-call-to-action-1.
export function Questions() {
  return (
    <section id="faq" className={`${pageWidth} ${blockSpace}`}>
      <div className="grid gap-7 md:grid-cols-2">
        <h2 className={`${titleStyle} max-w-sm`}>Before you try it.</h2>
        <FolioFAQ />
      </div>
    </section>
  );
}

export function Closing() {
  return (
    <section className={`${pageWidth} pb-14 sm:pb-20`}>
      <Reveal className="rounded-3xl bg-[#1d2b4b] bg-[radial-gradient(ellipse_at_top_right,#485b9c,transparent_60%)] px-6 py-14 text-white sm:py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className={titleStyle}>Build your first campaign in Folidock.</h2>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Button
              variant="secondary"
              size="lg"
              asChild
              className="rounded-full"
            >
              <Link href={site.primaryAction.href}>
                {site.primaryAction.label}
                <ArrowRight />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="ghost"
              asChild
              className="rounded-full text-white hover:bg-white/10 hover:text-white"
            >
              <Link href="/admin">
                <Shield />
                Open owner demo
              </Link>
            </Button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

const footerGroups = [
  {
    name: "Product",
    links: [
      { href: "/crm/overview", label: "CRM overview" },
      { href: "/crm/campaigns", label: "Campaigns" },
      { href: "/crm/inbox", label: "Inbox" },
    ],
  },
  {
    name: "Workspace",
    links: [
      { href: "/admin", label: "Owner demo" },
      { href: "/crm/pipeline", label: "Pipeline" },
    ],
  },
  {
    name: "Resources",
    links: [
      { href: source, label: "GitHub" },
      { href: source + "/blob/main/docs/UI-AUDIT.md", label: "UI audit" },
      { href: "#faq", label: "FAQ" },
    ],
  },
];

// Tailark dusk-footer-2: brand and navigation groups above a bottom bar.
export function MarketingFooter() {
  return (
    <footer className="border-t bg-muted/45">
      <div className={`${pageWidth} space-y-12 py-10`}>
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4 lg:grid-cols-6">
          <div className="col-span-full lg:col-span-3">
            <Brand />
            <p className="mt-3 max-w-55 text-sm text-muted-foreground">
              An open-source starter with a CRM, outbound workspace, and SaaS owner console.
            </p>
          </div>
          {footerGroups.map((group) => (
            <div key={group.name}>
              <span className="text-sm font-semibold">{group.name}</span>
              <ul className="mt-3 grid gap-2">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-5 text-sm text-muted-foreground">
          <span>Folidock · Open-source demo</span>
          <Link
            href={source}
            className="inline-flex items-center gap-2 hover:underline"
          >
            <GitBranch className="size-4" />
            View source
          </Link>
        </div>
      </div>
    </footer>
  );
}
