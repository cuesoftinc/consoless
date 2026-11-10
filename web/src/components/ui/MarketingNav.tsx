"use client";

/**
 * MarketingNav: the CueLABS marketing standard bar. Fixed inventory: four
 * text links (Features, Consoles, Docs and GitHub, where GitHub renders as
 * a compact star badge), the theme toggle, a "Sign in" text link and the
 * "Try Cloud" primary CTA. The star badge shows the live count when one is
 * passed and the neutral "Star" otherwise. A count is never hardcoded.
 * Below md the text links, the theme toggle and Sign in collapse into a
 * hamburger panel. The Try Cloud CTA stays visible beside the hamburger.
 */

import { useEffect, useId, useState } from "react";
import Link from "next/link";
import { Menu, Star, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { buttonClasses } from "./Button";
import IconButton from "./IconButton";
import LogoPlaceholder from "./LogoPlaceholder";
import ThemeToggle from "./ThemeToggle";

export type MarketingNavLinkId =
  "features" | "consoles" | "docs" | "github" | "sign-in" | "try-cloud";

export interface MarketingNavProps {
  /** Live GitHub star count. Null or undefined shows the neutral "Star". */
  starCount?: number | null;
  /** Analytics hook: fires with the id of the link that was pressed. */
  onLinkClick?: (id: string) => void;
  className?: string;
}

interface NavLink {
  id: MarketingNavLinkId;
  label: string;
  href: string;
  external?: boolean;
  star?: boolean;
}

export const MARKETING_NAV_LINKS: NavLink[] = [
  { id: "features", label: "Features", href: "#features" },
  { id: "consoles", label: "Consoles", href: "#consoles" },
  {
    id: "docs",
    label: "Docs",
    href: "https://cuesoft.gitbook.io/consoless",
    external: true,
  },
  {
    id: "github",
    label: "GitHub",
    href: "https://github.com/cuesoftinc/consoless",
    external: true,
    star: true,
  },
];

const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring";

const LINK_CLASSES = cn(
  "rounded-sm text-label-md text-text-secondary hover:text-text-primary",
  "transition-colors duration-fast ease-enter motion-reduce:transition-none",
  FOCUS_RING,
);

const STAR_CLASSES = cn(
  "inline-flex items-center gap-1 rounded-md border border-border-default px-2 py-1",
  "text-label-md text-text-secondary hover:border-border-strong hover:text-text-primary",
  "transition-colors duration-fast ease-enter motion-reduce:transition-none",
  FOCUS_RING,
);

/** GitHub brand glyph (not a Lucide icon). It inherits currentColor. */
function GitHubMark() {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden
      fill="currentColor"
      className="h-3.5 w-3.5"
    >
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.42 7.42 0 0 1 2-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
    </svg>
  );
}

export default function MarketingNav({
  starCount,
  onLinkClick,
  className,
}: MarketingNavProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  const renderLink = (link: NavLink, onNavigate?: () => void) => {
    const onClick = () => {
      onLinkClick?.(link.id);
      onNavigate?.();
    };
    const external = link.external
      ? { target: "_blank", rel: "noreferrer" }
      : {};
    if (link.star) {
      return (
        <a
          key={link.id}
          href={link.href}
          {...external}
          aria-label="Star cuesoftinc/consoless on GitHub"
          data-testid="star-badge"
          onClick={onClick}
          className={STAR_CLASSES}
        >
          <GitHubMark />
          <Star aria-hidden className="h-3 w-3" />
          <span>Star</span>
          {typeof starCount === "number" ? (
            <span data-testid="star-count" className="tabular-nums">
              {starCount.toLocaleString("en-US")}
            </span>
          ) : null}
        </a>
      );
    }
    return (
      <a
        key={link.id}
        href={link.href}
        {...external}
        onClick={onClick}
        className={LINK_CLASSES}
      >
        {link.label}
      </a>
    );
  };

  const signIn = (onNavigate?: () => void) => (
    <Link
      href="/signin"
      onClick={() => {
        onLinkClick?.("sign-in");
        onNavigate?.();
      }}
      className={LINK_CLASSES}
    >
      Sign in
    </Link>
  );

  const closeMenu = () => setMenuOpen(false);

  return (
    <header
      className={cn(
        "relative border-b border-border-default bg-bg-base",
        className,
      )}
    >
      <nav aria-label="Marketing">
        <div className="mx-auto flex h-16 max-w-[1312px] items-center gap-8 px-4 md:px-8">
          <Link href="/" className={cn("rounded-sm", FOCUS_RING)}>
            <LogoPlaceholder />
          </Link>

          <div className="hidden items-center gap-6 md:flex">
            {MARKETING_NAV_LINKS.map((link) => renderLink(link))}
          </div>

          <div className="ml-auto flex items-center gap-3">
            <div className="hidden items-center gap-4 md:flex">
              <ThemeToggle />
              {signIn()}
            </div>
            <Link
              href="/signin"
              onClick={() => onLinkClick?.("try-cloud")}
              className={buttonClasses("primary", "sm")}
            >
              Try Cloud
            </Link>
            <div className="md:hidden">
              <IconButton
                icon={menuOpen ? X : Menu}
                aria-label="Menu"
                aria-expanded={menuOpen}
                aria-controls={menuId}
                onClick={() => setMenuOpen((open) => !open)}
              />
            </div>
          </div>
        </div>

        {menuOpen ? (
          <div
            id={menuId}
            data-testid="marketing-nav-panel"
            className="absolute inset-x-0 top-full z-sticky border-b border-border-default bg-bg-base px-4 py-4 md:hidden"
          >
            <div className="flex flex-col items-start gap-4">
              {MARKETING_NAV_LINKS.map((link) => renderLink(link, closeMenu))}
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-border-default pt-4">
              <ThemeToggle />
              {signIn(closeMenu)}
            </div>
          </div>
        ) : null}
      </nav>
    </header>
  );
}
