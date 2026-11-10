import Link from "next/link";
import { buttonClasses } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <main
      id="main"
      tabIndex={-1}
      className="flex min-h-screen flex-col items-center justify-center gap-4 bg-bg-base px-4 text-center text-text-primary"
    >
      <p className="font-mono text-code-md text-text-muted">404</p>
      <h1 className="text-heading-lg">We could not find that page</h1>
      <p className="max-w-110 text-body-md text-text-secondary">
        The link may be old, or the page may have moved.
      </p>
      <Link href="/" className={buttonClasses("primary", "md")}>
        Go to the home page
      </Link>
    </main>
  );
}
