"use client";

/**
 * GenerationStatus (docs/design.md section 3): where a generation is, in
 * plain words. A polite live region, so each new state is read out. The
 * title always states the state; the icon and its colour only support it.
 */

import {
  CircleAlert,
  CircleCheck,
  Clock,
  LoaderCircle,
  RefreshCw,
  Shield,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/cn";
import Button from "./Button";

export type GenerationState =
  | "queued"
  | "generating"
  | "checking"
  | "retrying"
  | "ready"
  | "failed"
  | "refused";

const SPIN = "animate-spin motion-reduce:animate-none";

const ICONS: Record<GenerationState, { icon: LucideIcon; className: string }> =
  {
    queued: { icon: Clock, className: "text-text-secondary" },
    generating: { icon: LoaderCircle, className: cn("text-accent-text", SPIN) },
    checking: { icon: LoaderCircle, className: cn("text-accent-text", SPIN) },
    retrying: { icon: RefreshCw, className: "text-warning-text" },
    ready: { icon: CircleCheck, className: "text-success-text" },
    failed: { icon: CircleAlert, className: "text-danger-text" },
    refused: { icon: Shield, className: "text-warning-text" },
  };

export interface GenerationStatusProps {
  state: GenerationState;
  /** The version that is ready (state "ready"). */
  version?: number;
  /** The current attempt (state "retrying"). */
  attempt?: number;
  maxAttempts?: number;
  /** Shows "Try again" in the failed state. */
  onRetry?: () => void;
  className?: string;
}

function copy(
  state: GenerationState,
  version: number | undefined,
  attempt: number,
  maxAttempts: number,
): { title: string; detail: string } {
  switch (state) {
    case "queued":
      return {
        title: "In the queue",
        detail: "Your game starts building in a moment.",
      };
    case "generating":
      return {
        title: "Writing your game",
        detail: "Step 1 of 2. This usually takes under a minute.",
      };
    case "checking":
      return {
        title: "Checking that it runs",
        detail:
          "Step 2 of 2. We type-check the game and play it for a few seconds.",
      };
    case "retrying":
      return {
        title: "Fixing a problem",
        detail: `The last try failed a check. This is attempt ${attempt} of ${maxAttempts}.`,
      };
    case "ready":
      return {
        title:
          version === undefined
            ? "Your game is ready"
            : `Version ${version} is ready`,
        detail: "It passed its checks. Play it in the preview.",
      };
    case "failed":
      return {
        title: "We could not build this",
        detail: `The game failed its checks after ${maxAttempts} attempts. Try again or change the prompt.`,
      };
    case "refused":
      return {
        title: "We can’t make that",
        detail:
          "This prompt breaks the content policy. Change the prompt and try again. This did not use your quota.",
      };
  }
}

export default function GenerationStatus({
  state,
  version,
  attempt = 2,
  maxAttempts = 3,
  onRetry,
  className,
}: GenerationStatusProps) {
  const { icon: Icon, className: iconClassName } = ICONS[state];
  const { title, detail } = copy(state, version, attempt, maxAttempts);

  return (
    <div
      role="status"
      aria-live="polite"
      data-state={state}
      className={cn(
        "flex gap-3 rounded-md border border-border-default bg-bg-raised p-3",
        className,
      )}
    >
      <Icon
        aria-hidden
        data-testid="generation-status-icon"
        className={cn("h-5 w-5 shrink-0", iconClassName)}
      />
      <div className="flex min-w-0 flex-1 flex-col items-start gap-1">
        <p className="text-label-md text-text-primary">{title}</p>
        <p className="text-body-sm text-text-secondary">{detail}</p>
        {state === "failed" && onRetry ? (
          <Button
            kind="secondary"
            size="sm"
            icon={RefreshCw}
            onClick={onRetry}
            className="mt-1"
          >
            Try again
          </Button>
        ) : null}
      </div>
    </div>
  );
}
