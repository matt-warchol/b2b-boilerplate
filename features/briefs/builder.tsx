"use client";

import { Clipboard, Download, FileText } from "lucide-react";
import { useRef, useState } from "react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useOpportunities } from "@/features/opportunities/store";
import { buildBidBrief } from "./engine";

export function BriefBuilder() {
  const opportunities = useOpportunities();
  const [id, setId] = useState("");
  const [brief, setBrief] = useState("");
  const [feedback, setFeedback] = useState("");
  const output = useRef<HTMLTextAreaElement>(null);
  const record = opportunities.find((item) => item.id === id) ?? (id ? undefined : opportunities[0]);

  function download() {
    const url = URL.createObjectURL(new Blob([brief], { type: "text/plain;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = (record?.id ?? "draft") + "-bid-brief.txt";
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(brief);
      setFeedback("Brief copied.");
    } catch {
      output.current?.focus();
      output.current?.select();
      setFeedback("Text selected. Use your browser’s copy shortcut.");
    }
  }

  return <>
    <div className="workspace-heading">
      <div><h1>Bid briefs</h1><p>Turn an opportunity into a draft your team can review.</p></div>
    </div>
    <div className="brief-layout">
      <section className="brief-settings" aria-labelledby="brief-source">
        <h2 id="brief-source">Source</h2>
        {opportunities.length ? <>
          <div className="brief-field">
            <label htmlFor="brief-opportunity">Opportunity</label>
            <Select value={record?.id ?? ""} onValueChange={(value) => { setId(value); setBrief(""); setFeedback(""); }}>
              <SelectTrigger id="brief-opportunity" className="w-full"><SelectValue placeholder="Select an opportunity" /></SelectTrigger>
              <SelectContent>{opportunities.map((item) => <SelectItem key={item.id} value={item.id}>{item.title}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <p>This draft uses the fields on the opportunity. Check the official notice before sharing it.</p>
          <Button disabled={!record} onClick={() => { if (record) { setBrief(buildBidBrief(record)); setFeedback("Draft ready."); } }}>
            <FileText aria-hidden="true" /> {brief ? "Regenerate draft" : "Generate brief"}
          </Button>
        </> : <Link className={buttonVariants({ variant: "outline" })} href="/workspace">Add an opportunity</Link>}
      </section>
      <section className="brief-document" aria-labelledby="brief-result">
        <div className="document-heading">
          <h2 id="brief-result">Draft</h2>
          <div className="document-actions">
            <Button variant="outline" size="sm" disabled={!brief.trim()} onClick={copy}><Clipboard aria-hidden="true" /> Copy</Button>
            <Button variant="outline" size="sm" disabled={!brief.trim()} onClick={download}><Download aria-hidden="true" /> Download</Button>
          </div>
        </div>
        <textarea ref={output} aria-label="Draft brief" value={brief} onChange={(event) => { setBrief(event.target.value); setFeedback(""); }}
          placeholder="Generate a brief to start editing here." rows={15} />
        <div className="brief-feedback" role="status">{feedback}</div>
      </section>
    </div>
  </>;
}
