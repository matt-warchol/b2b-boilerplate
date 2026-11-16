"use client";

import Link from "next/link";
import { ArrowRight, Building2, Inbox, Menu, Send, Users, Workflow } from "lucide-react";
import { motion, MotionConfig, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { site } from "@/content/site";

const views = [
  { key: "people", icon: Users, label: "Relationships", title: "Know who you’re reaching out to.", text: "Find contacts by company or relationship status. Open a record to see who owns it and where the conversation left off.", points: ["Find the right contact", "See the relationship timeline", "Keep ownership visible"] },
  { key: "campaigns", icon: Send, label: "Outbound", title: "Make each follow-up count.", text: "Draft an introduction and follow-ups in the same workspace where you keep your contacts.", points: ["Build a three-step sequence", "Personalize the message", "Start and pause a simulation"] },
  { key: "inbox", icon: Inbox, label: "Inbox", title: "Take the next step when they reply.", text: "Open a sample conversation and save a response you can come back to.", points: ["Browse recent conversations", "Read replies in context", "Save a reply draft"] },
];

export function FolioNav() {
  return <>
    <NavigationMenu className="folio-desktop-nav">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Product</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="folio-mega-menu">{views.map(({ key, label, icon: Icon, title }) => (
              <NavigationMenuLink asChild key={key}><Link href={"/crm/" + key}><Icon className="size-5" /><strong>{label}</strong><span>{title}</span></Link></NavigationMenuLink>
            ))}</div>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem><NavigationMenuLink asChild className={navigationMenuTriggerStyle()}><a href="#workflow">Workflow</a></NavigationMenuLink></NavigationMenuItem>
        <NavigationMenuItem><NavigationMenuLink asChild className={navigationMenuTriggerStyle()}><a href="#faq">FAQ</a></NavigationMenuLink></NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
    <DropdownMenu>
      <DropdownMenuTrigger asChild><Button variant="outline" size="icon" className="folio-mobile-nav" aria-label="Menu"><Menu /></Button></DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {views.map(({ key, label }) => <DropdownMenuItem asChild key={key}><Link href={"/crm/" + key}>{label}</Link></DropdownMenuItem>)}
        <DropdownMenuItem asChild><a href="#workflow">Workflow</a></DropdownMenuItem>
        <DropdownMenuItem asChild><a href="#faq">FAQ</a></DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </>;
}

export function FolioProductTour() {
  const reduced = useReducedMotion();
  return <MotionConfig reducedMotion="user">
    <section id="workflow" className="container folio-tour">
      <h2>From first touch to next step.</h2>
      <p>See how contacts, sequences, and replies fit together.</p>
      <Tabs defaultValue="people" className="mt-7">
        <TabsList variant="line" className="w-full justify-start border-b sm:w-fit">
          {views.map(({ key, label, icon: Icon }) => <TabsTrigger key={key} value={key}><Icon />{label}</TabsTrigger>)}
        </TabsList>
        {views.map(({ key, label, icon: Icon, title, text, points }) => (
          <TabsContent key={key} value={key}><motion.div initial={reduced ? false : { opacity: 0.7, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22 }}>
            <Card className="folio-tour-card">
              <CardHeader><CardDescription>{label}</CardDescription><CardTitle><h3>{title}</h3></CardTitle><p>{text}</p><Button asChild className="mt-3 w-fit"><Link href={"/crm/" + key}>Explore {label.toLowerCase()} <ArrowRight /></Link></Button></CardHeader>
              <CardContent><ul>{points.map(point => <li key={point}><Icon className="size-5" />{point}</li>)}</ul></CardContent>
            </Card>
          </motion.div></TabsContent>
        ))}
      </Tabs>
      <div className="folio-use-cases">
        <Card><CardHeader><Building2 /><CardTitle>Run account-based outreach</CardTitle><CardDescription>Track the company and the people involved before writing your first message.</CardDescription></CardHeader><CardContent><Button asChild variant="outline"><Link href="/crm/companies">Browse companies <ArrowRight /></Link></Button></CardContent></Card>
        <Card><CardHeader><Workflow /><CardTitle>Hand off a warm opportunity</CardTitle><CardDescription>Move a deal to its next stage so your team knows where to pick it up.</CardDescription></CardHeader><CardContent><Button asChild variant="outline"><Link href="/crm/pipeline">Explore the pipeline <ArrowRight /></Link></Button></CardContent></Card>
      </div>
    </section>
  </MotionConfig>;
}

export function FolioFAQ() {
  return <Accordion type="single" collapsible>{site.faq.map(({ question, answer }, i) => (
    <AccordionItem value={"faq-" + i} key={question}><AccordionTrigger>{question}</AccordionTrigger><AccordionContent>{answer}</AccordionContent></AccordionItem>
  ))}</Accordion>;
}
