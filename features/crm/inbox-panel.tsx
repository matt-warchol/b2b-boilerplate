"use client";

import { useState } from "react";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Textarea } from "@/components/ui/textarea";
import { people, type Person } from "./data";
import { RecordAvatar } from "./record-avatar";

export const inboxContacts = [people[0], people[2], people[4]];
const subject = (person: Person) => "Re: A thought for " + person.company;

export function InboxPanel({
  drafts,
  onSave,
}: {
  drafts: Record<string, string>;
  onSave: (email: string, text: string) => void;
}) {
  const [contact, setContact] = useState(inboxContacts[0]);
  return (
    <Card className="grid gap-0 overflow-hidden py-0 lg:grid-cols-[minmax(15rem,1fr)_minmax(0,2.25fr)]">
      <section
        className="min-w-0 border-b p-4 lg:border-r lg:border-b-0"
        aria-label="Conversations"
      >
        <h2 className="flex items-center gap-2 px-2 pb-3 text-sm font-semibold">
          Recent conversations{" "}
          <Badge variant="secondary">{inboxContacts.length}</Badge>
        </h2>
        <ItemGroup className="gap-1.5">
          {inboxContacts.map((person) => (
            <div role="listitem" key={person.email}>
              <Item
                asChild
                size="sm"
                variant={contact.email === person.email ? "muted" : "default"}
                className="w-full flex-nowrap text-left hover:bg-accent/65 aria-pressed:border-border aria-pressed:bg-accent"
              >
                <button
                  type="button"
                  aria-pressed={contact.email === person.email}
                  onClick={() => setContact(person)}
                >
                  <ItemMedia>
                    <RecordAvatar
                      name={person.name}
                      color={person.color}
                      className="size-10"
                    />
                  </ItemMedia>
                  <ItemContent className="min-w-0">
                    <ItemTitle className="w-full text-sm font-semibold">
                      {person.name}
                    </ItemTitle>
                    <ItemDescription className="line-clamp-1 text-pretty">
                      {subject(person)}
                    </ItemDescription>
                  </ItemContent>
                </button>
              </Item>
            </div>
          ))}
        </ItemGroup>
      </section>
      <Thread
        key={contact.email}
        contact={contact}
        draft={drafts[contact.email] ?? ""}
        onSave={onSave}
      />
    </Card>
  );
}

function Thread({
  contact,
  draft,
  onSave,
}: {
  contact: Person;
  draft: string;
  onSave: (email: string, text: string) => void;
}) {
  const [reply, setReply] = useState<string | undefined>();
  const text = reply ?? draft;
  return (
    <section className="min-w-0 py-5">
      <CardHeader className="border-b pb-5">
        <CardTitle>
          <h2 className="text-xl font-semibold leading-snug tracking-tight">
            {subject(contact)}
          </h2>
        </CardTitle>
        <CardDescription className="break-all">{contact.email}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-5">
        <article className="space-y-4 text-base leading-relaxed">
          <header className="flex items-center gap-3">
            <RecordAvatar
              name={contact.name}
              color={contact.color}
              className="size-10"
            />
            <div>
              <div className="text-sm font-semibold">{contact.name}</div>
              <p className="text-sm text-muted-foreground">Today, 10:42 AM</p>
            </div>
          </header>
          <div className="max-w-prose space-y-3">
            <p>Hi Alex,</p>
            <p>
              Thanks for reaching out. We’ve been discussing this internally at{" "}
              {contact.company}.
            </p>
            <p>
              I’d love to see how this could work for our team. Would you have
              time for a quick conversation next week?
            </p>
            <p>
              Best,
              <br />
              {contact.name.split(" ")[0]}
            </p>
          </div>
        </article>
        <form
          className="grid gap-3 rounded-lg border p-4"
          onSubmit={(e) => {
            e.preventDefault();
            onSave(contact.email, text);
          }}
        >
          <label className="text-sm font-medium" htmlFor="reply-draft">
            Your reply
          </label>
          <Textarea
            id="reply-draft"
            rows={4}
            value={text}
            onChange={(e) => setReply(e.target.value)}
            className="text-base"
            placeholder="Write a reply…"
          />
          <Button
            type="submit"
            disabled={!text.trim()}
            className="justify-self-end"
          >
            <FileText />
            Save draft
          </Button>
        </form>
      </CardContent>
    </section>
  );
}
