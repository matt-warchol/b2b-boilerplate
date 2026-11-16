import Link from "next/link";
import { site } from "@/content/site";

export function Brand() {
  return (
    <Link href="/" className="brand" aria-label={site.name + " home"}>
      <span className="brand-mark"><FolidockMark /></span>
      <span>{site.name}</span>
    </Link>
  );
}

export function FolidockMark() {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M8 10 24 6M8 18l13-3.25M8 26l7.5-1.875" stroke="currentColor" strokeWidth="4.2" strokeLinecap="round" />
    </svg>
  );
}
