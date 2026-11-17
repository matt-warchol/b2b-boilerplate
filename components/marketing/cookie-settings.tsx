"use client";

import { Button } from "@/components/ui/button";

// Reopens the cookie banner (lib/consent.ts defines window.rzCookies).
export function CookieSettings() {
  return (
    <Button
      type="button"
      variant="link"
      className="h-auto p-0 text-sm font-normal text-muted-foreground hover:underline"
      onClick={() => (window as unknown as { rzCookies?: () => void }).rzCookies?.()}
    >
      Cookie settings
    </Button>
  );
}
