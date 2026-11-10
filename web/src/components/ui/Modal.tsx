"use client";

/**
 * Modal (docs/design.md section 3) on Radix Dialog, controlled by the
 * caller. Focus is trapped while it is open; Escape, the close button and
 * a click on the scrim all ask to close. `kind="destructive"` only marks
 * the dialog: the caller passes a danger Button in the footer.
 * MI-7: the scrim fades in over duration-base and the panel fades and
 * rises 8px, using CSS transitions from an @starting-style (`starting:`).
 * With reduced motion both appear at once.
 */

import type { ReactNode } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";
import IconButton from "./IconButton";

export type ModalSize = "sm" | "md";
export type ModalKind = "default" | "destructive";

const SIZE_CLASSES: Record<ModalSize, string> = {
  sm: "max-w-110",
  md: "max-w-130",
};

export interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children?: ReactNode;
  /** Actions, drawn in a right-aligned row. */
  footer?: ReactNode;
  size?: ModalSize;
  kind?: ModalKind;
  /** Merged onto the panel. */
  className?: string;
}

export default function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  size = "md",
  kind = "default",
  className,
}: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay
          data-testid="modal-overlay"
          className={cn(
            "fixed inset-0 z-modal bg-overlay-scrim",
            "transition-opacity duration-base ease-enter starting:opacity-0",
            "motion-reduce:transition-none motion-reduce:starting:opacity-100",
          )}
        />
        <Dialog.Content
          aria-modal="true"
          data-kind={kind}
          data-size={size}
          {...(description ? {} : { "aria-describedby": undefined })}
          className={cn(
            "fixed top-1/2 left-1/2 z-modal flex w-[calc(100vw-2rem)] -translate-x-1/2 -translate-y-1/2 flex-col gap-4 rounded-xl border border-border-default bg-bg-surface p-6 shadow-lg",
            "transition-[opacity,translate] duration-base ease-enter starting:translate-y-[calc(-50%+8px)] starting:opacity-0",
            "motion-reduce:transition-none motion-reduce:starting:-translate-y-1/2 motion-reduce:starting:opacity-100",
            SIZE_CLASSES[size],
            className,
          )}
        >
          <div className="flex items-start justify-between gap-4">
            <Dialog.Title className="text-heading-md text-text-primary">
              {title}
            </Dialog.Title>
            <Dialog.Close asChild>
              <IconButton icon={X} aria-label="Close" />
            </Dialog.Close>
          </div>
          {description ? (
            <Dialog.Description className="text-body-md text-text-secondary">
              {description}
            </Dialog.Description>
          ) : null}
          {children}
          {footer ? (
            <div
              data-testid="modal-footer"
              className="flex items-center justify-end gap-3"
            >
              {footer}
            </div>
          ) : null}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
