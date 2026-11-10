"use client";

/**
 * PopoverMenu: a trigger that opens a Menu in a popover. Radix Popover
 * gives the placement, outside-click and Escape handling, and returns
 * focus to the trigger on close. Choosing an item closes the menu.
 */

import { useState, type ReactElement, type ReactNode } from "react";
import * as Popover from "@radix-ui/react-popover";
import Menu from "./Menu";

export interface PopoverMenuProps {
  /** The control that opens the menu. It must forward refs and props. */
  trigger: ReactElement;
  /** Accessible name of the menu. */
  "aria-label": string;
  /** MenuItem elements. */
  children: ReactNode;
  align?: "start" | "end";
}

export default function PopoverMenu({
  trigger,
  "aria-label": ariaLabel,
  children,
  align = "end",
}: PopoverMenuProps) {
  const [open, setOpen] = useState(false);
  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>{trigger}</Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align={align}
          sideOffset={4}
          aria-label={ariaLabel}
          className="z-overlay outline-none"
          // Any activated item closes the menu.
          onClick={(event) => {
            const target = event.target as HTMLElement;
            if (target.closest('[role="menuitem"]')) setOpen(false);
          }}
        >
          <Menu aria-label={ariaLabel}>{children}</Menu>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
