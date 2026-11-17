"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { MessageCircle, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

type Turn = { role: "user" | "assistant"; content: string };

// Short on purpose: what it is, what happens to the message, and that any language works.
const greeting: Turn = {
  role: "assistant",
  content: "This is the feedback agent. Ask a question and I answer from our knowledge base, or tell us what to improve: we read it and use it to make the product better for you. Any language works.",
};

// Turns [Name](/path) into an in-app link. Only same-site paths are allowed; everything else stays plain text.
function Linked({ text }: { text: string }) {
  const parts: React.ReactNode[] = [];
  const re = /\[([^\]]{1,60})\]\((\/[A-Za-z0-9\-_/#?=&.]{0,120})\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m[2].startsWith("//")) continue;
    parts.push(text.slice(last, m.index));
    parts.push(
      <Link key={m.index} href={m[2]} className="font-medium underline underline-offset-2">
        {m[1]}
      </Link>,
    );
    last = re.lastIndex;
  }
  parts.push(text.slice(last));
  return <>{parts}</>;
}

export function FeedbackWidget() {
  const [open, setOpen] = useState(false);
  const [turns, setTurns] = useState<Turn[]>([greeting]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const session = useRef<string>("");
  const end = useRef<HTMLDivElement>(null);

  useEffect(() => {
    session.current = crypto.randomUUID();
  }, []);
  useEffect(() => {
    end.current?.scrollIntoView({ block: "end" });
  }, [turns, open]);

  async function send() {
    const text = draft.trim();
    if (!text || busy) return;
    const next = [...turns, { role: "user", content: text } as Turn];
    setTurns(next);
    setDraft("");
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/feedback/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: session.current, pageUrl: location.href, messages: next.slice(1) }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(typeof data.error === "string" ? data.error : "Message not sent. Try again.");
      setTurns([...next, { role: "assistant", content: data.reply }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Message not sent. Try again.");
      setDraft(text);
      setTurns(turns);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed right-4 bottom-4 z-50 flex flex-col items-end gap-2 print:hidden">
      {open && (
        <Card role="dialog" aria-label="Feedback agent" className="w-[min(22rem,calc(100vw-2rem))] gap-3 py-4 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between px-4">
            <CardTitle className="text-sm">Feedback agent</CardTitle>
            <Button variant="ghost" size="icon" aria-label="Close feedback chat" onClick={() => setOpen(false)}>
              <X aria-hidden="true" />
            </Button>
          </CardHeader>
          <CardContent className="max-h-72 space-y-2 overflow-y-auto px-4" aria-live="polite">
            {turns.map((t, i) => (
              <p key={i} className={t.role === "user" ? "ml-8 rounded-lg bg-primary px-3 py-2 text-sm text-primary-foreground" : "mr-8 rounded-lg bg-muted px-3 py-2 text-sm"}>
                {t.role === "user" ? t.content : <Linked text={t.content} />}
              </p>
            ))}
            {busy && <p className="text-muted-foreground text-xs">Thinking…</p>}
            {error && <p className="text-destructive text-xs" role="alert">{error}</p>}
            <div ref={end} />
          </CardContent>
          <CardFooter className="gap-2 px-4">
            <Textarea
              value={draft}
              maxLength={1000}
              rows={2}
              placeholder="Ask or tell us what to improve"
              aria-label="Message"
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void send();
                }
              }}
            />
            <Button size="icon" aria-label="Send message" disabled={busy || !draft.trim()} onClick={() => void send()}>
              <Send aria-hidden="true" />
            </Button>
          </CardFooter>
        </Card>
      )}
      <Button size="lg" className="rounded-full shadow-lg" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
        <MessageCircle aria-hidden="true" /> {open ? "Close" : "Feedback"}
      </Button>
    </div>
  );
}
