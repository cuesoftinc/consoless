"use client";

// The error boundary for every route: the token-styled counterpart to
// not-found.tsx. Without it an uncaught render error falls through to
// Next's unstyled default. "Try again" re-renders the segment.
import Link from "next/link";
import Button, { buttonClasses } from "@/components/ui/Button";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main
      id="main"
      tabIndex={-1}
      className="flex min-h-screen flex-col items-center justify-center gap-4 bg-bg-base px-4 text-center text-text-primary"
    >
      <h1 className="text-heading-lg">Something went wrong</h1>
      <p className="max-w-110 text-body-md text-text-secondary">
        An unexpected error interrupted this screen. Your games are safe.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button onClick={() => reset()}>Try again</Button>
        <Link href="/" className={buttonClasses("secondary", "md")}>
          Go to the home page
        </Link>
      </div>
    </main>
  );
}
