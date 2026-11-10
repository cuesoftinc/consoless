"use client";

/**
 * SignInGate: the /signin reverse gate. A signed-in visitor is replaced to
 * /dashboard and never sees the sign-in screen; while the session read is
 * in flight an aria-busy hold renders. The dashboard holds the mirror gate
 * (useRequireAuth).
 */

import type { ReactNode } from "react";
import { useRedirectAuthed } from "@/controllers/auth";

export default function SignInGate({ children }: { children: ReactNode }) {
  const { user, checked } = useRedirectAuthed();

  if (!checked || user) {
    return (
      <div
        aria-busy="true"
        data-testid="signin-gate"
        className="flex min-h-screen items-center justify-center bg-bg-base"
      >
        <span className="sr-only">Loading…</span>
      </div>
    );
  }

  return <>{children}</>;
}
