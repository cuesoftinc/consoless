import Link from "next/link";

export default function NotFound() {
  return (
    <main
      id="main"
      tabIndex={-1}
      className="flex h-screen flex-col items-center justify-center gap-4 bg-gaming-900 px-6 font-sans text-white"
    >
      <p className="font-mono text-sm text-gray-400">404</p>
      <h1 className="font-retro text-2xl tracking-tight">Page Not Found</h1>
      <p className="max-w-md text-center text-sm text-gray-400">
        This page does not exist. Head back to the hub to keep playing.
      </p>
      <Link
        href="/"
        className="rounded-lg bg-gaming-accent px-6 py-2.5 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-red-600"
      >
        Back to Home
      </Link>
    </main>
  );
}
