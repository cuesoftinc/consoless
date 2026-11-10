import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** The one centred container every landing band aligns to. */
export const CONTAINER = "mx-auto w-full max-w-[1312px] px-4 md:px-8";

export interface SectionProps {
  /** Anchor id; also labels the section through its heading. */
  id: string;
  title: string;
  intro?: string;
  children: ReactNode;
  className?: string;
}

/** A landing band: a labelled section with a heading and optional intro. */
export default function Section({
  id,
  title,
  intro,
  children,
  className,
}: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className={cn("scroll-mt-16 py-12 md:py-16", className)}
    >
      <div className={cn(CONTAINER, "flex flex-col gap-8")}>
        <div className="flex max-w-180 flex-col gap-2">
          <h2
            id={`${id}-heading`}
            className="text-heading-lg text-text-primary"
          >
            {title}
          </h2>
          {intro ? (
            <p className="text-body-md text-text-secondary">{intro}</p>
          ) : null}
        </div>
        {children}
      </div>
    </section>
  );
}

/** A bordered card used across the landing bands. */
export function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-lg border border-border-default bg-bg-surface p-6",
        className,
      )}
    >
      {children}
    </div>
  );
}

export const externalLinkProps = {
  target: "_blank",
  rel: "noreferrer",
} as const;
