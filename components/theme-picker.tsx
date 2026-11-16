"use client";

import { Palette } from "lucide-react";
import { useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { site } from "@/content/site";
import { isTheme, themes, themeStorageKey } from "@/content/themes";

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

function readTheme() {
  const value = document.documentElement.dataset.theme;
  return isTheme(value) ? value : site.theme;
}

export function useTheme() {
  return useSyncExternalStore(subscribe, readTheme, () => site.theme);
}

function selectTheme(value: string) {
  if (!isTheme(value)) return;
  document.documentElement.dataset.theme = value;
  try {
    localStorage.setItem(themeStorageKey, value);
  } catch {
    // The current page still works when browser storage is blocked.
  }
  const url = new URL(window.location.href);
  url.searchParams.set("theme", value);
  window.history.replaceState(null, "", url);
}

export function ThemePicker() {
  const theme = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="shrink-0" aria-label="Visual style" title="Visual style">
          <Palette />
          <span className="hidden sm:inline">Style</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-60">
        <DropdownMenuLabel>Visual style</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={theme} onValueChange={selectTheme}>
          {themes.map(({ id, name, description }) => (
            <DropdownMenuRadioItem key={id} value={id} className="py-2">
              <span className="theme-swatch size-4 shrink-0 rounded-full border" data-swatch={id} aria-hidden="true" />
              <span>
                <span className="block font-medium">{name}</span>
                <span className="block text-xs text-muted-foreground">{description}</span>
              </span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
