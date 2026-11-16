"use client";
/* eslint-disable react-hooks/incompatible-library -- TanStack Table v8 owns its own reactive state. */

import {
  createColumnHelper, flexRender, getCoreRowModel, getFilteredRowModel,
  getPaginationRowModel, getSortedRowModel, useReactTable, type SortingState,
} from "@tanstack/react-table";
import { ArrowDown, ArrowDownUp, ArrowUp, ChevronLeft, ChevronRight, Plus, Search } from "lucide-react";
import { MotionConfig, motion } from "motion/react";
import { useMemo, useRef, useState, type MouseEvent } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
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
      <button className="record-link" onClick={(event) => show(event, row.original)}><span>{getValue()}</span><small>{row.original.id}</small></button>,
    }),
    column.accessor("buyer", { header: "Buyer", cell: ({ row, getValue }) =>
      <span className="cell-stack"><span>{getValue()}</span>{row.original.region && <small>{row.original.region}</small>}</span>,
    }),
    column.accessor("stage", { header: "Stage", cell: ({ getValue }) =>
      <span className={"stage " + stageClass[getValue()]}>{getValue()}</span>,
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
    <MotionConfig reducedMotion="user">
      <div className="views" role="group" aria-label="Saved views">
        {views.map((item) => <button key={item} type="button" aria-pressed={view === item} onClick={() => setView(item)}>
          {item}
          {view === item && <motion.span className="view-indicator" layoutId="active-view" transition={{ duration: 0.18 }} aria-hidden="true" />}
        </button>)}
      </div>
    </MotionConfig>
    <div className="table-tools">
      <div className="search-field">
        <Search aria-hidden="true" />
        <input type="search" aria-label="Search opportunities" placeholder="Search opportunities..." value={search} onChange={(event) => setSearch(event.target.value)} />
      </div>
      <span aria-live="polite">{filteredCount} {filteredCount === 1 ? "opportunity" : "opportunities"}</span>
    </div>
    {storageIssue && <p className="notice" role="status">Browser storage is unavailable. Your changes will last until this page is reloaded.</p>}
    <div className="table-scroll" tabIndex={0} role="region" aria-label="Opportunities table">
      <table className="data-table">
        <thead>{table.getHeaderGroups().map((group) => <tr key={group.id}>{group.headers.map((header) => {
          const sort = header.column.getIsSorted();
          const Icon = sort === "desc" ? ArrowDown : sort === "asc" ? ArrowUp : ArrowDownUp;
          return <th key={header.id} scope="col" aria-sort={sort === "asc" ? "ascending" : sort === "desc" ? "descending" : undefined}>
            <button className="sort-button" onClick={header.column.getToggleSortingHandler()}>
              {flexRender(header.column.columnDef.header, header.getContext())}<Icon aria-hidden="true" />
            </button>
          </th>;
        })}</tr>)}</thead>
        <tbody>{rows.map((row) => <tr key={row.id}>{row.getVisibleCells().map((cell) =>
          <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>,
        )}</tr>)}</tbody>
      </table>
    </div>
    {rows.length === 0 && <div className="empty-state">
      <p>{search.trim() ? "No opportunities match your search." : "This view has no opportunities yet."}</p>
      {search.trim() ? <Button variant="outline" size="sm" onClick={() => setSearch("")}>Clear search</Button>
        : view !== "All opportunities" && <Button variant="outline" size="sm" onClick={() => setView("All opportunities")}>Show all opportunities</Button>}
    </div>}
    {table.getPageCount() > 1 && <div className="pagination">
      <span>Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}</span>
      <Button variant="outline" size="icon" aria-label="Previous page" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}><ChevronLeft aria-hidden="true" /></Button>
      <Button variant="outline" size="icon" aria-label="Next page" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}><ChevronRight aria-hidden="true" /></Button>
    </div>}
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="sheet-content" onCloseAutoFocus={(event) => {
        event.preventDefault();
        (opener.current?.isConnected ? opener.current : newButton.current)?.focus();
      }}>
        <OpportunityEditor key={record?.id ?? "new"} record={record} onSave={(persistent) => { setStorageIssue(!persistent); setOpen(false); }} />
      </SheetContent>
    </Sheet>
  </>;
}
