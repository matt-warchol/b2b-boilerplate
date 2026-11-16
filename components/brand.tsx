import Link from "next/link";
import { site } from "@/content/site";

export function Brand() {
  return <Link href="/" className="brand" aria-label={site.name + " home"}>
    <span className="brand-mark"><FolioMark /></span>
    <span>{site.name}</span>
  </Link>;
}

export function FolioMark() {
  return <svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="M7 8 24 4v6L7 14V8Zm0 10 17-4v6L7 24v-6Zm0 10 8-2v4l-8 2v-4Z" fill="currentColor" /></svg>;
}
