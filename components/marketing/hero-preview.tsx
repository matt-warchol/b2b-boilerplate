"use client";

import Image from "next/image";
import Link from "next/link";
import { useTheme } from "@/components/theme-picker";

export function HeroPreview() {
  const theme = useTheme();
  const basename = theme === "zinc" ? "/crm-preview" : "/crm-preview-" + theme;

  return (
    <div className="product-hero-frame overflow-hidden p-2.5 sm:p-5 lg:p-8">
      <Link
        href="/crm/overview"
        className="product-hero-shot block overflow-hidden bg-background ring-1 ring-white/30 shadow-2xl transition-[filter] hover:brightness-[1.025]"
        aria-label="Open the Folidock CRM overview"
      >
        <picture>
          <source
            media="(max-width: 600px)"
            srcSet={basename + "-mobile.webp"}
            width={390}
            height={844}
          />
          <Image
            src={basename + ".webp"}
            width={1512}
            height={1100}
            sizes="(max-width: 600px) 90vw, (max-width: 1280px) 92vw, 1170px"
            className="h-auto w-full"
            fetchPriority="high"
            unoptimized
            alt="Folidock CRM overview showing campaign performance, contacts, and sample activity."
          />
        </picture>
      </Link>
    </div>
  );
}
