/**
 * Skeleton (docs/design.md section 3): loading placeholders. Every
 * data-driven screen builds its loading frame from these. MI-6: opacity
 * pulses on a 1.5s loop; under reduced motion the block stays still.
 */

import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";

export type SkeletonKind = "line" | "block" | "circle";

const KIND_CLASSES: Record<SkeletonKind, string> = {
  line: "h-3 w-60 rounded-sm",
  block: "h-34 w-60 rounded-md",
  circle: "h-10 w-10 rounded-full",
};

export interface SkeletonProps {
  kind?: SkeletonKind;
  /** Override the size with utilities or inline dimensions. */
  className?: string;
  style?: CSSProperties;
}

export default function Skeleton({
  kind = "line",
  className,
  style,
}: SkeletonProps) {
  return (
    <span
      aria-hidden
      data-kind={kind}
      data-testid="skeleton"
      style={style}
      className={cn(
        "block animate-pulse bg-bg-hover motion-reduce:animate-none",
        KIND_CLASSES[kind],
        className,
      )}
    />
  );
}
