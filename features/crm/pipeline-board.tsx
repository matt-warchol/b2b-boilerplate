"use client";

import { GripVertical } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Empty, EmptyDescription } from "@/components/ui/empty";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Kanban,
  KanbanBoard,
  KanbanColumn,
  KanbanItem,
  KanbanItemHandle,
  KanbanOverlay,
} from "@/components/ui/kanban";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { money, type Deal } from "./data";
import { RecordAvatar } from "./record-avatar";

const stages = ["Qualified", "Discovery", "Proposal", "Won"] as const;
type Columns = Record<string, Deal[]>;
const dealId = (deal: Deal) => deal.company;

function splitDeals(deals: Deal[]) {
  const columns: Columns = { Qualified: [], Discovery: [], Proposal: [], Won: [] };
  for (const deal of deals) {
    const stage = stages.find((stage) => stage === deal.stage) ?? "Qualified";
    columns[stage].push(deal);
  }
  return columns;
}

function DealCard({ deal, handle, stageControl }: {
  deal: Deal;
  handle?: React.ReactNode;
  stageControl?: React.ReactNode;
}) {
  return (
    <Card className="pipeline-deal gap-3 rounded-(--radius) p-3 shadow-xs">
      <div className="flex items-start gap-2.5">
        <RecordAvatar name={deal.company} color={deal.color} square />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{deal.company}</p>
          <h3 className="text-sm leading-snug text-muted-foreground">{deal.title}</h3>
        </div>
        {handle}
      </div>
      <strong className="text-lg font-semibold tabular-nums">{money(deal.value)}</strong>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <RecordAvatar name={deal.person} color={deal.color} className="size-6" />
        {deal.person}
      </div>
      {stageControl}
    </Card>
  );
}

export function PipelineBoard({ deals, onChange, storageError }: {
  deals: Deal[];
  onChange: (deals: Deal[]) => void;
  storageError: string;
}) {
  const reducedMotion = useReducedMotion();
  const saved = useMemo(() => splitDeals(deals), [deals]);
  const [preview, setPreview] = useState<Columns | null>(null);
  const latestPreview = useRef<Columns | null>(null);
  const pendingFocus = useRef<string | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const columns = preview ?? saved;

  useEffect(() => {
    if (pendingFocus.current) document.getElementById(pendingFocus.current)?.focus({ preventScroll: true });
    pendingFocus.current = null;
  }, [deals, storageError]);

  function showPreview(next: Columns) {
    latestPreview.current = next;
    setPreview(next);
  }

  function finishDrag(commit: boolean, company?: string) {
    // Dice UI reports its final sorted value after its drag-end callback.
    queueMicrotask(() => {
      const next = latestPreview.current;
      latestPreview.current = null;
      setPreview(null);
      if (!commit || !next) return;
      onChange(stages.flatMap((stage) => next[stage].map((deal) => ({ ...deal, stage }))));
      const stage = stages.find((stage) => next[stage].some((deal) => deal.company === company));
      if (stage) setAnnouncement(`${company} moved to ${stage}.`);
    });
  }

  return (
    <div className="grid min-w-0 gap-4">
      <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-sm text-muted-foreground">
          <span>Sales pipeline</span>
          <strong className="text-lg text-foreground tabular-nums">{money(deals.reduce((total, deal) => total + deal.value, 0))}</strong>
          <span>{deals.length} opportunities</span>
        </div>
        <p className="text-sm text-muted-foreground">Drag a deal or use its stage menu.</p>
      </div>
      <Kanban
        value={columns}
        getItemValue={dealId}
        onValueChange={showPreview}
        onDragStart={() => setAnnouncement("")}
        onDragEnd={({ active, over }) => finishDrag(over !== null, String(active.id))}
        onDragCancel={() => finishDrag(false)}
      >
        <KanbanBoard
          role="region"
          aria-label="Sales pipeline board"
          tabIndex={0}
          className="pipeline-board grid h-auto auto-cols-[minmax(15rem,1fr)] grid-flow-col items-stretch gap-3 overflow-x-auto p-1 pb-3"
        >
          {stages.map((stage) => (
            <KanbanColumn key={stage} value={stage} asChild className="min-h-90 gap-3 rounded-xl bg-muted/60 p-2.5 dark:bg-muted/60 data-[over]:border-ring data-[over]:bg-accent/40 dark:data-[over]:bg-accent/40">
              <section aria-label={stage}>
                <header className="flex items-start justify-between gap-2 px-1 pb-1 pt-0.5">
                  <div>
                    <h2 className="flex items-center gap-2 text-sm font-semibold">
                      <span className={`pipeline-stage-dot ${stage.toLowerCase()}`} aria-hidden="true" />
                      {stage}
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground tabular-nums">
                      {money(columns[stage].reduce((total, deal) => total + deal.value, 0))}
                    </p>
                  </div>
                  <Badge variant="outline" className="bg-card tabular-nums" aria-label={`${columns[stage].length} deals`}>
                    {columns[stage].length}
                  </Badge>
                </header>
                {columns[stage].length === 0 && (
                  <Empty className="rounded-md border border-dashed p-4 md:p-4">
                    <EmptyDescription>Drop a deal here</EmptyDescription>
                  </Empty>
                )}
                {columns[stage].map((deal) => {
                  const selectId = `stage-${deal.company}`;
                  return (
                    <KanbanItem key={deal.company} value={deal.company}>
                      <DealCard
                        deal={deal}
                        handle={(
                          <KanbanItemHandle asChild>
                            <Button variant="ghost" size="icon" className="size-9 shrink-0 touch-none text-muted-foreground" aria-label={`Drag ${deal.company}`}>
                              <GripVertical />
                            </Button>
                          </KanbanItemHandle>
                        )}
                        stageControl={(
                          <Select value={stage} onValueChange={(nextStage) => {
                            pendingFocus.current = selectId;
                            onChange(deals.map((entry) => entry.company === deal.company ? { ...entry, stage: nextStage } : entry));
                            setAnnouncement(`${deal.company} moved to ${nextStage}.`);
                          }}>
                            <SelectTrigger id={selectId} aria-label={`Stage for ${deal.company}`} className="w-full bg-background pr-3">
                              <SelectValue>{stage}</SelectValue>
                            </SelectTrigger>
                            <SelectContent position="popper">
                              {stages.map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </KanbanItem>
                  );
                })}
              </section>
            </KanbanColumn>
          ))}
        </KanbanBoard>
        <KanbanOverlay dropAnimation={reducedMotion ? null : undefined}>
          {({ value }) => {
            const deal = deals.find((deal) => deal.company === value);
            return deal && <div className="rounded-(--radius) ring-2 ring-ring"><DealCard deal={deal} /></div>;
          }}
        </KanbanOverlay>
      </Kanban>
      {storageError && (
        <Alert variant="destructive">
          <AlertDescription>{storageError}</AlertDescription>
        </Alert>
      )}
      <p role="status" className="sr-only">{storageError ? "" : announcement}</p>
    </div>
  );
}
