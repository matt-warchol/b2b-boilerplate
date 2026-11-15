import { Radar } from "lucide-react";
import Link from "next/link";
import { site } from "@/content/site";

export function Brand() {
  return <Link href="/" className="brand" aria-label={site.name + " home"}>
    <span className="brand-mark"><Radar aria-hidden="true" /></span>
    <span>{site.name}</span>
  </Link>;
}
