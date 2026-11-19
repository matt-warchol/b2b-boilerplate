"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Inbox, Menu, Send, Users } from "lucide-react";
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

export function FolioNav() {
  return (
    <>
      <NavigationMenu className="folio-desktop-nav">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Product</NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="folio-mega-menu">
                {views.map(({ key, label, icon: Icon, title }) => (
                  <NavigationMenuLink asChild key={key}>
                    <Link href={"/crm/" + key}>
                      <Icon className="size-5" />
                      <strong>{label}</strong>
                      <span>{title}</span>
                    </Link>
                  </NavigationMenuLink>
                ))}
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={navigationMenuTriggerStyle()}
            >
              <a href="#workflow">Workflow</a>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={navigationMenuTriggerStyle()}
            >
              <a href="#get-started">Get started</a>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={navigationMenuTriggerStyle()}
            >
              <Link href="/changelog">Changelog</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="folio-mobile-nav ml-auto"
            aria-label="Menu"
          >
            <Menu />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {views.map(({ key, label }) => (
            <DropdownMenuItem asChild key={key}>
              <Link href={"/crm/" + key}>{label}</Link>
            </DropdownMenuItem>
          ))}
          <DropdownMenuItem asChild>
            <a href="#workflow">Workflow</a>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <a href="#get-started">Get started</a>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/changelog">Changelog</Link>
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
