"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import type { ComponentProps } from "react";
import { Button } from "./button";

export const Sheet = Dialog.Root;
export const SheetTitle = Dialog.Title;
export const SheetDescription = Dialog.Description;

export function SheetContent({ children, ...props }: ComponentProps<typeof Dialog.Content>) {
  return <Dialog.Portal>
    <Dialog.Overlay className="sheet-overlay" />
    <Dialog.Content className="sheet-content" {...props}>
      {children}
      <Dialog.Close asChild>
        <Button size="icon" variant="ghost" className="sheet-close" aria-label="Close">
          <X aria-hidden="true" />
        </Button>
      </Dialog.Close>
    </Dialog.Content>
  </Dialog.Portal>;
}
