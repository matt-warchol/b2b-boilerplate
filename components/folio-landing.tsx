"use client";

import type React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ChartColumn,
  Columns3,
  Inbox,
  ListChecks,
  Menu,
  Rocket,
  Route,
  Send,
  ShieldCheck,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react";
import { motion, MotionConfig } from "motion/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { site } from "@/content/site";

const views = [
  {
    key: "people",
    icon: Users,
    label: "Relationships",
    title: "Know who you’re reaching out to.",
    text: "Find contacts by company or relationship status. Open a record to see who owns it and where the conversation left off.",
    screenshot: "/marketing-people.webp",
    alt: "Contact directory with relationship statuses and account owners",
  },
  {
    key: "campaigns",
    icon: Send,
    label: "Outbound",
    title: "Make each follow-up count.",
    text: "Draft an introduction and follow-ups in the same workspace where you keep your contacts.",
    screenshot: "/marketing-campaigns.webp",
    alt: "Campaign list and the three-step sequence editor",
  },
  {
    key: "inbox",
    icon: Inbox,
    label: "Inbox",
    title: "Take the next step when they reply.",
    text: "Open a sample conversation and save a response you can come back to.",
    screenshot: "/marketing-inbox.webp",
    alt: "Shared inbox with a sample conversation and reply composer",
  },
];

type MenuItem = { href: string; icon: LucideIcon; title: string; text: string };

// Edit these two lists per product. Mega menu pattern: shadcn NavigationMenu + Tailark-style items.
const productMenu: MenuItem[] = [
  { href: "/crm/people", icon: Users, title: "Relationships", text: "Contacts by company, owner and status." },
  { href: "/crm/pipeline", icon: Columns3, title: "Pipeline", text: "Every deal on one board, with the next step." },
  { href: "/crm/campaigns", icon: Send, title: "Outbound", text: "Introductions and follow-ups in one place." },
  { href: "/crm/inbox", icon: Inbox, title: "Inbox", text: "Reply and save the next step." },
  { href: "/crm/tasks", icon: ListChecks, title: "Tasks", text: "What is due today, per owner." },
  { href: "/crm/analytics", icon: ChartColumn, title: "Analytics", text: "Replies, meetings and won deals." },
];

const resourcesMenu: MenuItem[] = [
  { href: "/changelog", icon: Sparkles, title: "Changelog", text: "What is new, week by week." },
  { href: "/#workflow", icon: Route, title: "Workflow", text: "How contacts, sequences and replies fit." },
  { href: "/#get-started", icon: Rocket, title: "Get started", text: "Open the sample workspace." },
  { href: "/privacy", icon: ShieldCheck, title: "Privacy", text: "What data we keep and why." },
];

function MenuLink({ item }: { item: MenuItem }) {
  const Icon = item.icon;
  return (
    <NavigationMenuLink asChild>
      <Link href={item.href} className="flex flex-row items-start gap-3.5 rounded-xl p-3 transition-colors hover:bg-muted">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border bg-background shadow-xs">
          <Icon className="size-[18px] text-foreground" />
        </span>
        <span className="grid gap-0.5">
          <span className="text-[15px] font-semibold text-foreground">{item.title}</span>
          <span className="text-sm leading-snug text-muted-foreground">{item.text}</span>
        </span>
      </Link>
    </NavigationMenuLink>
  );
}

function FeatureCard({ href, image, title, text, cta }: { href: string; image: string; title: string; text: string; cta: string }) {
  return (
    <NavigationMenuLink asChild>
      <Link href={href} className="group relative flex min-h-64 flex-col justify-end overflow-hidden rounded-2xl bg-muted p-3">
        <Image src={image} alt="" fill sizes="272px" className="object-cover object-left-top transition-transform duration-500 group-hover:scale-[1.03]" />
        <span className="relative grid gap-1 rounded-xl border bg-background/90 p-4 backdrop-blur">
          <span className="text-[15px] font-semibold text-foreground">{title}</span>
          <span className="text-sm leading-snug text-muted-foreground">{text}</span>
          <span className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-foreground">
            {cta} <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </span>
        </span>
      </Link>
    </NavigationMenuLink>
  );
}

function MegaMenu({ label, items, feature }: { label: string; items: MenuItem[]; feature: React.ReactNode }) {
  return (
    <div className="grid w-[min(62rem,92vw)] grid-cols-[1fr_17rem] gap-4 p-4">
      <div>
        <p className="px-3 pt-1 pb-2 text-xs font-medium text-muted-foreground">{label}</p>
        <div className="grid grid-cols-2 gap-1">
          {items.map((item) => (
            <MenuLink key={item.href} item={item} />
          ))}
        </div>
      </div>
      {feature}
    </div>
  );
}

export function FolioNav() {
  return (
    <>
      <NavigationMenu className="folio-desktop-nav">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Product</NavigationMenuTrigger>
            <NavigationMenuContent>
              <MegaMenu
                label="Product"
                items={productMenu}
                feature={<FeatureCard href="/crm/overview" image="/marketing-pipeline.webp" title="Open the sample workspace" text="Click through a CRM filled with fictional data." cta="Take the tour" />}
              />
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
            <NavigationMenuContent>
              <MegaMenu
                label="Resources"
                items={resourcesMenu}
                feature={<FeatureCard href="/changelog" image="/marketing-inbox.webp" title="What shipped this week" text="Short notes on every new feature and fix." cta="Read the changelog" />}
              />
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
              <Link href="/#workflow">Workflow</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
              <Link href="/changelog">Changelog</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="folio-mobile-nav ml-auto" aria-label="Menu">
            <Menu />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuLabel>Product</DropdownMenuLabel>
          {productMenu.map(({ href, title, icon: Icon }) => (
            <DropdownMenuItem asChild key={href}>
              <Link href={href}>
                <Icon /> {title}
              </Link>
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Resources</DropdownMenuLabel>
          {resourcesMenu.map(({ href, title, icon: Icon }) => (
            <DropdownMenuItem asChild key={href}>
              <Link href={href}>
                <Icon /> {title}
              </Link>
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href={site.primaryAction.href} className="font-semibold">
              {site.primaryAction.label}
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

export function FolioProductTour() {
  return (
    <MotionConfig reducedMotion="user">
      <section id="workflow" className="container folio-tour">
        <h2>From first touch to next step.</h2>
        <p>See how contacts, sequences, and replies fit together.</p>
        <Tabs defaultValue="people" className="mt-7">
          <TabsList
            variant="line"
            className="w-full justify-start border-b sm:w-fit"
          >
            {views.map(({ key, label, icon: Icon }) => (
              <TabsTrigger key={key} value={key}>
                <Icon />
                {label}
              </TabsTrigger>
            ))}
          </TabsList>
          {views.map(({ key, label, title, text, screenshot, alt }) => (
            <TabsContent key={key} value={key}>
              <motion.div
                data-marketing-motion
                initial={{ opacity: 0.7, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.22 }}
              >
                <Card className="folio-tour-card">
                  <CardHeader>
                    <CardDescription>{label}</CardDescription>
                    <CardTitle>
                      <h3>{title}</h3>
                    </CardTitle>
                    <p>{text}</p>
                    <Button asChild className="mt-3 w-fit">
                      <Link href={"/crm/" + key}>
                        Explore {label.toLowerCase()} <ArrowRight />
                      </Link>
                    </Button>
                  </CardHeader>
                  <CardContent className="self-center">
                    <Image
                      src={screenshot}
                      alt={alt}
                      width={860}
                      height={540}
                      unoptimized
                      className="h-auto w-full rounded-lg border bg-card shadow-sm"
                    />
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          ))}
        </Tabs>
      </section>
    </MotionConfig>
  );
}

export function FolioFAQ() {
  return (
    <Accordion type="single" collapsible>
      {site.faq.map(({ question, answer }, i) => (
        <AccordionItem
          value={"faq-" + i}
          key={question}
          className="border-dashed"
        >
          <AccordionTrigger className="text-base">{question}</AccordionTrigger>
          <AccordionContent className="text-base text-muted-foreground">
            {answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
