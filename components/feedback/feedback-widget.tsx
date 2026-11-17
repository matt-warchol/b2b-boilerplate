"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { MessageCircle, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

type Turn = { role: "user" | "assistant"; content: string };

const greeting: Turn = {
  role: "assistant",
  content: "Hi! Ask about the product or share what we should improve. I answer from our knowledge base, and the team reads every suggestion. Any language works.",
};

// Only render in-app links. Never treat the assistant's reply as HTML.
function Linked({ text }: { text: string }) {
  const parts: React.ReactNode[] = [];
  const re = /\[([^\]]{1,60})\]\((\/[A-Za-z0-9\-_/#?=&.]{0,120})\)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  while ((match = re.exec(text))) {
    if (match[2].startsWith("//")) continue;
    parts.push(text.slice(last, match.index));
    parts.push(
      <Link key={match.index} href={match[2]} className="font-medium underline underline-offset-2">
        {match[1]}
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
  const session = useRef("");
  const log = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    session.current = crypto.randomUUID();
  }, []);

  useEffect(() => {
    // Scroll the conversation, never the page underneath the widget.
    if (log.current) log.current.scrollTop = log.current.scrollHeight;
  }, [turns, busy, open]);

  useEffect(() => {
    if (!open && wasOpen.current) trigger.current?.focus();
    wasOpen.current = open;
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  async function send() {
    const text = draft.trim();
    if (!text || busy) return;
    const next: Turn[] = [...turns, { role: "user", content: text }];
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
      if (!res.ok || typeof data.reply !== "string" || !data.reply.trim()) {
        throw new Error(typeof data.error === "string" ? data.error : "Message not sent. Try again.");
      }
      setTurns([...next, { role: "assistant", content: data.reply }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Message not sent. Try again.");
      setDraft(text);
      setTurns(turns);
    } finally {
      setBusy(false);
    }
  }

  const animation = reduceMotion
    ? { initial: false as const, animate: { opacity: 1 }, exit: { opacity: 1 } }
    : {
        initial: { opacity: 0, y: 10, scale: 0.985 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: 6, scale: 0.99 },
      };

  return (
    <div className="pointer-events-none fixed inset-x-3 bottom-3 z-50 flex flex-col items-end print:hidden sm:inset-x-auto sm:right-5 sm:bottom-5">
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            key="conversation"
            initial={animation.initial}
            animate={animation.animate}
            exit={animation.exit}
            transition={{ duration: reduceMotion ? 0 : 0.18, ease: "easeOut" }}
            className="pointer-events-auto w-full max-w-96 sm:w-96"
          >
            <Card role="dialog" aria-label="Feedback agent" aria-modal="false" className="max-h-[calc(100dvh-1.5rem)] min-h-64 w-full gap-0 overflow-hidden rounded-2xl py-0 shadow-2xl">
              <CardHeader className="flex shrink-0 flex-row items-center justify-between gap-3 border-b px-4 py-3">
                <div className="flex min-w-0 items-center gap-2.5">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-muted">
                    <MessageCircle className="size-4" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <CardTitle className="text-sm">Feedback agent</CardTitle>
                    <p className="mt-1 text-xs text-muted-foreground">Ask anything · Share an idea</p>
                  </div>
                </div>
                <Button type="button" variant="ghost" size="icon" className="size-9 shrink-0" aria-label="Close feedback chat" onClick={() => setOpen(false)}>
                  <X aria-hidden="true" />
                </Button>
              </CardHeader>
              <CardContent ref={log} aria-live="polite" aria-relevant="additions text" aria-busy={busy} className="flex min-h-32 max-h-[min(21rem,48dvh)] flex-col gap-2.5 overflow-y-auto px-4 py-4">
                {turns.map((t, index) => (
                  <motion.div
                    key={index}
                    initial={reduceMotion ? false : { opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: reduceMotion ? 0 : 0.14 }}
                    className={t.role === "user" ? "ml-auto max-w-[88%] rounded-2xl rounded-br-md bg-primary px-3 py-2.5 text-sm leading-relaxed text-primary-foreground whitespace-pre-wrap break-words" : "mr-auto max-w-[92%] rounded-2xl rounded-bl-md bg-muted px-3 py-2.5 text-sm leading-relaxed whitespace-pre-wrap break-words"}
                  >
                    {t.role === "user" ? t.content : <Linked text={t.content} />}
                  </motion.div>
                ))}
                {busy && (
                  <p className="flex items-center gap-2 text-xs text-muted-foreground" role="status">
                    <span className="size-2 animate-pulse rounded-full bg-muted-foreground motion-reduce:animate-none" aria-hidden="true" />
                    Thinking…
                  </p>
                )}
                {error && <p className="text-xs text-destructive" role="alert">{error}</p>}
              </CardContent>
              <CardFooter className="shrink-0 border-t bg-card px-3 py-3">
                <form className="flex w-full min-w-0 items-end gap-2" onSubmit={(event) => { event.preventDefault(); void send(); }}>
                  <Textarea
                    value={draft}
                    maxLength={1000}
                    rows={2}
                    placeholder="Ask a question or share feedback…"
                    aria-label="Message"
                    className="max-h-28 min-h-11 min-w-0 flex-1 resize-none text-sm"
                    onChange={(event) => setDraft(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
                        event.preventDefault();
                        void send();
                      }
                    }}
                  />
                  <Button type="submit" size="icon-lg" className="size-11 shrink-0 rounded-xl" aria-label="Send message" disabled={busy || !draft.trim()}>
                    <Send className="size-4" aria-hidden="true" />
                  </Button>
                </form>
              </CardFooter>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="trigger"
            initial={reduceMotion ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.15 }}
            className="pointer-events-auto"
          >
            <Button ref={trigger} type="button" size="lg" className="rounded-full shadow-lg" aria-expanded={false} aria-label="Open feedback agent" onClick={() => setOpen(true)}>
              <MessageCircle aria-hidden="true" /> Feedback
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
