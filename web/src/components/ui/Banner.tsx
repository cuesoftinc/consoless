/**
 * Banner (docs/design.md section 3): a persistent inline message inside a
 * view. The icon and the text carry the meaning; the tint only supports it.
 * Danger is announced at once (role="alert"); the other kinds are polite.
 */

import type { ReactNode } from "react";
import {
  CircleAlert,
  CircleCheck,
  Info,
  TriangleAlert,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/cn";

export type BannerKind = "info" | "warning" | "danger" | "success";

const KIND: Record<BannerKind, { icon: LucideIcon; bg: string; text: string }> =
  {
    info: { icon: Info, bg: "bg-accent-subtle", text: "text-accent-text" },
    warning: {
      icon: TriangleAlert,
      bg: "bg-warning-subtle",
      text: "text-warning-text",
    },
    danger: {
      icon: CircleAlert,
      bg: "bg-danger-subtle",
      text: "text-danger-text",
    },
    success: {
      icon: CircleCheck,
      bg: "bg-success-subtle",
      text: "text-success-text",
    },
  };

export interface BannerProps {
  kind: BannerKind;
  children: ReactNode;
  /** Trailing action, usually a small Button. */
  action?: ReactNode;
  className?: string;
}

export default function Banner({
  kind,
  children,
  action,
  className,
}: BannerProps) {
  const { icon: Icon, bg, text } = KIND[kind];
  return (
    <div
      role={kind === "danger" ? "alert" : "status"}
      data-kind={kind}
      className={cn("flex items-start gap-3 rounded-md p-3", bg, className)}
    >
      <Icon
        aria-hidden
        data-testid="banner-icon"
        className={cn("h-5 w-5 shrink-0", text)}
      />
      <div className="flex-1 text-body-sm text-text-primary">{children}</div>
      {action}
    </div>
  );
}
