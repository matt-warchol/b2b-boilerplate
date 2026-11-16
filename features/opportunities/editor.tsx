"use client";

import type { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { SheetDescription, SheetTitle } from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { stages, type Opportunity, type Stage } from "./model";
import { saveOpportunity } from "./store";

export function OpportunityEditor({ record, onSave }: {
  record: Opportunity | null;
  onSave: (persistent: boolean) => void;
}) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    const field = (name: string) => String(values.get(name) ?? "").trim();
    const title = field("title");
    const buyer = field("buyer");
    for (const [name, value] of [["title", title], ["buyer", buyer]]) {
      if (value) continue;
      const input = form.elements.namedItem(name) as HTMLInputElement;
      input.setCustomValidity("Enter a value.");
      input.reportValidity();
      return;
    }
    onSave(saveOpportunity({
      id: record?.id ?? "DR-" + crypto.randomUUID().slice(0, 8).toUpperCase(),
      title, buyer,
      region: field("region"),
      deadline: field("deadline"),
      stage: field("stage") as Stage,
      nextStep: field("nextStep"),
    }));
  }

  return <div className="editor">
    <SheetTitle>{record ? "Edit opportunity" : "New opportunity"}</SheetTitle>
    <SheetDescription>{record ? record.id + " / " + record.buyer : "Add a tender to the demo workspace."}</SheetDescription>
    <form onSubmit={handleSubmit} className="record-form">
      <label>Opportunity<input name="title" maxLength={120} defaultValue={record?.title} required onInput={(e) => e.currentTarget.setCustomValidity("")} /></label>
      <label>Buyer<input name="buyer" maxLength={100} defaultValue={record?.buyer} required onInput={(e) => e.currentTarget.setCustomValidity("")} /></label>
      <div className="form-pair">
        <label>Region<input name="region" maxLength={80} defaultValue={record?.region} /></label>
        <label>Deadline<input name="deadline" type="date" min="1900-01-01" max="2100-12-31" defaultValue={record?.deadline} /></label>
      </div>
      <label>Stage<Select name="stage" defaultValue={record?.stage ?? "New"}>
        <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
        <SelectContent>{stages.map((stage) => <SelectItem key={stage} value={stage}>{stage}</SelectItem>)}</SelectContent>
      </Select></label>
      <label>Next step<textarea name="nextStep" maxLength={600} rows={4} defaultValue={record?.nextStep} /></label>
      <div className="form-actions"><Button type="submit">Save opportunity</Button></div>
    </form>
  </div>;
}
