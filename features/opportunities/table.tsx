"use client";
/* eslint-disable react-hooks/incompatible-library -- TanStack Table v8 owns its own reactive state. */

import {
  createColumnHelper, flexRender, getCoreRowModel, getFilteredRowModel,
  getPaginationRowModel, getSortedRowModel, useReactTable, type SortingState,
} from "@tanstack/react-table";
import { ArrowDown, ArrowDownUp, ArrowUp, ChevronLeft, ChevronRight, Inbox, Plus, Search, TriangleAlert } from "lucide-react";
import { useMemo, useRef, useState, type MouseEvent } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OpportunityEditor } from "./editor";
import { formatDeadline, type Opportunity, type Stage } from "./model";
import { useOpportunities } from "./store";

const views = ["All opportunities", "Shortlisted", "In review", "Passed"] as const;
type View = (typeof views)[number];
const column = createColumnHelper<Opportunity>();
export const stageClass: Record<Stage, string> = { New: "stage-new", "In review": "stage-review", Shortlisted: "stage-shortlist", Passed: "stage-passed" };

export function OpportunityTable() {
  const opportunities = useOpportunities();
  const [view, setView] = useState<View>("All opportunities");
  const [search, setSearch] = useState("");
  const [sorting, setSorting] = useState<SortingState>([{ id: "deadline", desc: false }]);
  const [open, setOpen] = useState(false);
  const [record, setRecord] = useState<Opportunity | null>(null);
  const [storageIssue, setStorageIssue] = useState(false);
  const opener = useRef<HTMLButtonElement>(null);
  const newButton = useRef<HTMLButtonElement>(null);

  function show(event: MouseEvent<HTMLButtonElement>, selected: Opportunity | null) {
    opener.current = event.currentTarget;
    setRecord(selected);
    setOpen(true);
  }

  const columns = useMemo(() => [
    column.accessor("title", { header: "Opportunity", cell: ({ row, getValue }) =>
      <Button variant="link" className="h-auto flex-col items-start gap-0.5 p-0 text-left font-semibold whitespace-normal text-foreground" onClick={(event) => show(event, row.original)}><span>{getValue()}</span><small className="text-xs font-normal text-muted-foreground">{row.original.id}</small></Button>,
    }),
    column.accessor("buyer", { header: "Buyer", cell: ({ row, getValue }) =>
      <span className="grid gap-0.5"><span>{getValue()}</span>{row.original.region && <small className="text-xs text-muted-foreground">{row.original.region}</small>}</span>,
    }),
    column.accessor("stage", { header: "Stage", cell: ({ getValue }) =>
      <Badge variant="secondary" className={stageClass[getValue()]}>{getValue()}</Badge>,
    }),
    column.accessor((row) => row.deadline || undefined, { id: "deadline", header: "Deadline", sortUndefined: "last", cell: ({ getValue }) => formatDeadline(getValue() ?? "") }),
  ], []);
  const data = useMemo(() => view === "All opportunities" ? opportunities : opportunities.filter((item) => item.stage === view), [opportunities, view]);
  const table = useReactTable({
    data, columns, state: { sorting, globalFilter: search }, onSortingChange: setSorting,
    getRowId: (row) => row.id,
    getColumnCanGlobalFilter: () => true,
    globalFilterFn: (row, columnId, value: string) => {
      const query = value.trim().toLowerCase();
      const field = columnId === "title" ? row.original.title + " " + row.original.id
        : columnId === "buyer" ? row.original.buyer + " " + row.original.region
        : String(row.getValue(columnId) ?? "");
      return field.toLowerCase().includes(query);
    },
    initialState: { pagination: { pageSize: 8 } },
    getCoreRowModel: getCoreRowModel(), getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(), getPaginationRowModel: getPaginationRowModel(),
  });
  const rows = table.getRowModel().rows;
  const filteredCount = table.getFilteredRowModel().rows.length;

  return <>
    <div className="workspace-heading">
      <div>
        <h1>Opportunities</h1>
        <p>Review upcoming tenders and decide which ones to pursue.</p>
      </div>
      <Button ref={newButton} onClick={(event) => show(event, null)}><Plus aria-hidden="true" /> New opportunity</Button>
    </div>
    <Tabs value={view} onValueChange={(value) => setView(value as View)}>
      <TabsList variant="line" aria-label="Saved views">
        {views.map((item) => <TabsTrigger key={item} value={item}>{item}</TabsTrigger>)}
      </TabsList>
    </Tabs>
    <div className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm text-muted-foreground tabular-nums">
      <div className="relative w-full max-w-64">
        <Search aria-hidden="true" className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input type="search" aria-label="Search opportunities" placeholder="Search opportunities..." value={search} onChange={(event) => setSearch(event.target.value)} className="pl-8" />
      </div>
      <span aria-live="polite">{filteredCount} {filteredCount === 1 ? "opportunity" : "opportunities"}</span>
    </div>
    {storageIssue && <Alert role="status" className="mb-3"><TriangleAlert aria-hidden="true" /><AlertDescription>Browser storage is unavailable. Your changes will last until this page is reloaded.</AlertDescription></Alert>}
    <div className="rounded-md border" tabIndex={0} role="region" aria-label="Opportunities table">
      <Table className="min-w-[39rem]">
        <TableHeader className="bg-muted/50">{table.getHeaderGroups().map((group) => <TableRow key={group.id}>{group.headers.map((header) => {
          const sort = header.column.getIsSorted();
          const Icon = sort === "desc" ? ArrowDown : sort === "asc" ? ArrowUp : ArrowDownUp;
          return <TableHead key={header.id} scope="col" aria-sort={sort === "asc" ? "ascending" : sort === "desc" ? "descending" : undefined}>
            <Button variant="ghost" size="sm" className="-ml-2 text-muted-foreground" onClick={header.column.getToggleSortingHandler()}>
              {flexRender(header.column.columnDef.header, header.getContext())}<Icon aria-hidden="true" />
            </Button>
          </TableHead>;
        })}</TableRow>)}</TableHeader>
        <TableBody>{rows.map((row) => <TableRow key={row.id}>{row.getVisibleCells().map((cell) =>
          <TableCell key={cell.id} className={cell.column.id === "deadline" ? "tabular-nums" : undefined}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>,
        )}</TableRow>)}</TableBody>
      </Table>
    </div>
    {rows.length === 0 && <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon"><Inbox aria-hidden="true" /></EmptyMedia>
        <EmptyTitle>{search.trim() ? "No matches" : "Nothing here yet"}</EmptyTitle>
        <EmptyDescription>{search.trim() ? "No opportunities match your search." : "This view has no opportunities yet."}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        {search.trim() ? <Button variant="outline" size="sm" onClick={() => setSearch("")}>Clear search</Button>
          : view !== "All opportunities" && <Button variant="outline" size="sm" onClick={() => setView("All opportunities")}>Show all opportunities</Button>}
      </EmptyContent>
    </Empty>}
    {table.getPageCount() > 1 && <div className="mt-3 flex items-center justify-end gap-2 text-sm text-muted-foreground">
      <span>Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}</span>
      <Button variant="outline" size="icon" aria-label="Previous page" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}><ChevronLeft aria-hidden="true" /></Button>
      <Button variant="outline" size="icon" aria-label="Next page" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}><ChevronRight aria-hidden="true" /></Button>
    </div>}
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="overflow-y-auto sm:max-w-md" onCloseAutoFocus={(event) => {
        event.preventDefault();
        (opener.current?.isConnected ? opener.current : newButton.current)?.focus();
      }}>
        <OpportunityEditor key={record?.id ?? "new"} record={record} onSave={(persistent) => { setStorageIssue(!persistent); setOpen(false); }} />
      </SheetContent>
    </Sheet>
  </>;
}
