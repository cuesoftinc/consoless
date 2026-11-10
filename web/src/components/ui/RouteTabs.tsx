"use client";

/**
 * RouteTabs (docs/design.md section 3): the Tabs look where every tab is a
 * real link to a sub-route. A labelled tablist of link tabs; the active
 * route carries aria-selected and aria-current="page". Roving tabindex
 * with ArrowLeft, ArrowRight, Home and End moving focus only: activation
 * stays manual, so moving focus never navigates. The active route's
 * content renders as the labelled tabpanel. The bar scrolls sideways on
 * narrow screens instead of widening the page.
 */

import { useRef, type KeyboardEvent, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

export interface RouteTabItem {
  href: string;
  label: string;
}

/** Stable, slug-safe DOM id for a tab link, so the panel can point at it. */
const tabId = (href: string) =>
  `route-tab-${href.replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-+|-+$/g, "")}`;

export interface RouteTabsProps {
  tabs: RouteTabItem[];
  "aria-label": string;
  className?: string;
  /** Extra classes for the tabpanel wrapper, such as a max width. */
  paneClassName?: string;
  /** The active sub-route content, rendered as the labelled tabpanel. */
  children?: ReactNode;
}

export default function RouteTabs({
  tabs,
  "aria-label": ariaLabel,
  className,
  paneClassName,
  children,
}: RouteTabsProps) {
  const pathname = usePathname() ?? "";
  const links = useRef(new Map<string, HTMLAnchorElement>());

  // The longest matching href wins, so a parent route does not stay
  // active while one of its child tabs is open.
  const active = tabs
    .filter(
      (tab) => pathname === tab.href || pathname.startsWith(`${tab.href}/`),
    )
    .sort((a, b) => b.href.length - a.href.length)[0];
  // Roving focus falls back to the first tab when no route matches.
  const rovingHref = active?.href ?? tabs[0]?.href;

  const onKeyDown = (
    event: KeyboardEvent<HTMLAnchorElement>,
    index: number,
  ) => {
    const last = tabs.length - 1;
    const next =
      event.key === "ArrowRight"
        ? index === last
          ? 0
          : index + 1
        : event.key === "ArrowLeft"
          ? index === 0
            ? last
            : index - 1
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? last
              : -1;
    if (next === -1) return;
    event.preventDefault();
    links.current.get(tabs[next].href)?.focus();
  };

  return (
    <div className={className}>
      <div
        role="tablist"
        aria-label={ariaLabel}
        // The 4px padding (cancelled by the margin) leaves room for the
        // focus ring, which the scroll container would otherwise clip.
        className="-m-1 flex gap-6 overflow-x-auto p-1"
      >
        {tabs.map((tab, index) => {
          const selected = active?.href === tab.href;
          return (
            <Link
              key={tab.href}
              ref={(node) => {
                if (node) links.current.set(tab.href, node);
                else links.current.delete(tab.href);
              }}
              id={tabId(tab.href)}
              role="tab"
              href={tab.href}
              aria-selected={selected}
              aria-current={selected ? "page" : undefined}
              tabIndex={tab.href === rovingHref ? 0 : -1}
              data-state={selected ? "active" : "inactive"}
              onKeyDown={(event) => onKeyDown(event, index)}
              className={cn(
                "shrink-0 border-b-2 px-1 py-3 text-label-md whitespace-nowrap",
                "transition-colors duration-base ease-move motion-reduce:transition-none",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring",
                selected
                  ? "border-accent-default text-text-primary"
                  : "border-transparent text-text-secondary hover:text-text-primary",
              )}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
      <div
        role="tabpanel"
        aria-labelledby={active ? tabId(active.href) : undefined}
        className={cn("pt-4", paneClassName)}
      >
        {children}
      </div>
    </div>
  );
}
