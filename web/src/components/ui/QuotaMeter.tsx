/**
 * QuotaMeter (docs/design.md section 3): the daily generation quota. The
 * count is always written out, so the bar colour is never the only signal.
 */

import { cn } from "@/lib/cn";

export type QuotaLevel = "ok" | "low" | "out";

const FILL_CLASSES: Record<QuotaLevel, string> = {
  ok: "bg-accent-default",
  low: "bg-warning-text",
  out: "bg-danger-default",
};

export interface QuotaMeterProps {
  /** Generations used today. */
  used: number;
  /** Generations allowed per day. */
  limit: number;
  className?: string;
}

export default function QuotaMeter({
  used,
  limit,
  className,
}: QuotaMeterProps) {
  const left = Math.max(0, limit - used);
  const level: QuotaLevel = left === 0 ? "out" : left <= 5 ? "low" : "ok";
  const percent = limit > 0 ? Math.min(100, (left / limit) * 100) : 0;

  return (
    <div
      role="meter"
      aria-valuemin={0}
      aria-valuemax={limit}
      aria-valuenow={left}
      aria-label="Generations left today"
      data-level={level}
      className={cn("flex w-70 flex-col gap-2", className)}
    >
      <div className="flex items-center justify-between">
        <span className="text-label-sm text-text-secondary">Generations</span>
        <span className="text-label-sm text-text-primary">
          {left} of {limit} left today
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-bg-hover">
        <div
          data-testid="quota-meter-fill"
          className={cn("h-full rounded-full", FILL_CLASSES[level])}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
