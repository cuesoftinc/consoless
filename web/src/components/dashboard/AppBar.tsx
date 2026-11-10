"use client";

/**
 * AppBar: the signed-in app chrome. Logo, the area links, today's quota,
 * the theme toggle and the account menu. Render-only: the shell passes the
 * user and the sign-out callback in.
 */

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { CircleUser } from "lucide-react";
import IconButton from "@/components/ui/IconButton";
import { MenuItem } from "@/components/ui/Menu";
import PopoverMenu from "@/components/ui/PopoverMenu";
import QuotaMeter from "@/components/ui/QuotaMeter";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { cn } from "@/lib/cn";
import type { Me } from "@/models";

export interface AppBarLink {
  href: string;
  label: string;
  /** Also active on deeper paths. */
  nested?: boolean;
}

export const APP_LINKS: AppBarLink[] = [
  { href: "/dashboard", label: "My Games" },
  { href: "/dashboard/settings", label: "Settings", nested: true },
];

export interface AppBarProps {
  /** Null while the user is loading. */
  me: Me | null;
  onSignOut: () => void;
}

const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring";

export default function AppBar({ me, onSignOut }: AppBarProps) {
  const pathname = usePathname() ?? "/dashboard";
  const router = useRouter();
  const isActive = (link: AppBarLink) =>
    pathname === link.href ||
    (link.nested === true && pathname.startsWith(`${link.href}/`));

  return (
    <header className="sticky top-0 z-sticky border-b border-border-default bg-bg-base">
      <div className="mx-auto flex h-16 w-full max-w-312 items-center gap-6 px-4 md:px-8">
        <Link
          href="/dashboard"
          className={cn("rounded-sm text-heading-sm text-text-primary", FOCUS)}
        >
          Consoless
        </Link>

        <nav
          aria-label="App"
          className="flex min-w-0 flex-1 items-center gap-1"
        >
          {APP_LINKS.map((link) => {
            const active = isActive(link);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-md px-3 py-2 text-label-md whitespace-nowrap",
                  "transition-colors duration-fast ease-enter motion-reduce:transition-none",
                  active
                    ? "bg-bg-hover text-text-primary"
                    : "text-text-secondary hover:text-text-primary",
                  FOCUS,
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {me ? (
          <div className="hidden w-70 shrink-0 lg:block">
            <QuotaMeter used={me.quota.used} limit={me.quota.limit} />
          </div>
        ) : null}

        <ThemeToggle />

        {me ? (
          <PopoverMenu
            aria-label="Account"
            trigger={<IconButton icon={CircleUser} aria-label="Account menu" />}
          >
            <div className="px-3 py-2">
              <p className="truncate text-label-md text-text-primary">
                {me.display_name}
              </p>
              <p className="truncate text-caption text-text-secondary">
                {me.email}
              </p>
            </div>
            <MenuItem onSelect={() => router.push("/dashboard/settings")}>
              Settings
            </MenuItem>
            <MenuItem onSelect={onSignOut}>Sign out</MenuItem>
          </PopoverMenu>
        ) : null}
      </div>
    </header>
  );
}
