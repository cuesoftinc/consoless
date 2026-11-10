/**
 * ArcadeBar: the chrome of the public Arcade. Visitors get a Sign in link;
 * signed-in players get a link back to My Games.
 */

import Link from "next/link";
import { buttonClasses } from "@/components/ui/Button";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { cn } from "@/lib/cn";

export interface ArcadeBarProps {
  /** Null while the session is being read: no account link is shown. */
  signedIn: boolean | null;
}

const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring";

export default function ArcadeBar({ signedIn }: ArcadeBarProps) {
  return (
    <header className="sticky top-0 z-sticky border-b border-border-default bg-bg-base">
      <div className="mx-auto flex h-16 w-full max-w-312 items-center gap-6 px-4 md:px-8">
        <Link
          href="/"
          className={cn("rounded-sm text-heading-sm text-text-primary", FOCUS)}
        >
          Consoless
        </Link>
        <nav aria-label="Arcade" className="flex min-w-0 flex-1 items-center">
          <Link
            href="/arcade"
            className={cn(
              "rounded-md px-3 py-2 text-label-md text-text-secondary hover:text-text-primary",
              "transition-colors duration-fast ease-enter motion-reduce:transition-none",
              FOCUS,
            )}
          >
            Arcade
          </Link>
        </nav>
        <ThemeToggle />
        {signedIn === true ? (
          <Link href="/dashboard" className={buttonClasses("secondary", "sm")}>
            My Games
          </Link>
        ) : null}
        {signedIn === false ? (
          <Link href="/signin" className={buttonClasses("secondary", "sm")}>
            Sign in
          </Link>
        ) : null}
      </div>
    </header>
  );
}
