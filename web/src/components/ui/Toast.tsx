"use client";

/**
 * Toast (docs/design.md section 3): the presentational toast card. It only
 * draws one toast. MI-5 (slide in over 300ms, stay 5 seconds, fade out,
 * errors stay until dismissed) is the viewport's job, as are the timers and
 * the stack; see ToastViewport.
 */

import {
  CircleAlert,
  CircleCheck,
  Info,
  X,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/cn";
import IconButton from "./IconButton";

export type ToastKind = "success" | "error" | "info";

const KIND: Record<ToastKind, { icon: LucideIcon; text: string }> = {
  success: { icon: CircleCheck, text: "text-success-text" },
  error: { icon: CircleAlert, text: "text-danger-text" },
  info: { icon: Info, text: "text-accent-text" },
};

export interface ToastProps {
  kind: ToastKind;
  title: string;
  body?: string;
  /** Shows the dismiss button when set. */
  onDismiss?: () => void;
  className?: string;
}

export default function Toast({
  kind,
  title,
  body,
  onDismiss,
  className,
}: ToastProps) {
  const { icon: Icon, text } = KIND[kind];
  return (
    <div
      role={kind === "error" ? "alert" : "status"}
      data-kind={kind}
      className={cn(
        "flex w-90 max-w-full items-start gap-3 rounded-lg border border-border-strong bg-bg-raised p-4 shadow-lg",
        className,
      )}
    >
      <Icon
        aria-hidden
        data-testid="toast-icon"
        className={cn("h-5 w-5 shrink-0", text)}
      />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <p className="text-label-md text-text-primary">{title}</p>
        {body ? (
          <p className="text-body-sm text-text-secondary">{body}</p>
        ) : null}
      </div>
      {onDismiss ? (
        <IconButton icon={X} aria-label="Dismiss" onClick={onDismiss} />
      ) : null}
    </div>
  );
}
