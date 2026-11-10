"use client";

/**
 * FAQItem: one question in a single-open accordion. The parent owns which
 * item is open. The answer region is labelled by its question.
 */

import { useId } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

export interface FAQItemProps {
  question: string;
  answer: string;
  expanded: boolean;
  onToggle: () => void;
  className?: string;
}

export default function FAQItem({
  question,
  answer,
  expanded,
  onToggle,
  className,
}: FAQItemProps) {
  const id = useId();
  return (
    <div
      data-state={expanded ? "open" : "closed"}
      className={cn("border-b border-border-default", className)}
    >
      <h3>
        <button
          type="button"
          id={`${id}-question`}
          aria-expanded={expanded}
          aria-controls={`${id}-answer`}
          onClick={onToggle}
          className={cn(
            "flex w-full items-center justify-between gap-4 py-4 text-left text-heading-sm text-text-primary",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring",
          )}
        >
          <span>{question}</span>
          <ChevronDown
            aria-hidden
            className={cn(
              "h-5 w-5 shrink-0 text-text-muted transition-transform duration-base ease-move motion-reduce:transition-none",
              expanded && "rotate-180",
            )}
          />
        </button>
      </h3>
      <div
        id={`${id}-answer`}
        role="region"
        aria-labelledby={`${id}-question`}
        hidden={!expanded}
        className="pb-4 text-body-md text-text-secondary"
      >
        {answer}
      </div>
    </div>
  );
}
