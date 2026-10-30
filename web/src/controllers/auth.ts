"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuthProvider, type AuthUser } from "@/auth";

/** Landing-page auth flow: a successful sign-in opens the dashboard. */
export function useAuthController() {
  const router = useRouter();

  const signIn = useCallback(async () => {
    await getAuthProvider().signInWithGoogle();
    router.push("/dashboard");
  }, [router]);

  return { signIn };
}

function readSession(): AuthUser | null {
  try {
    return getAuthProvider().currentUser();
  } catch {
    return null;
  }
}

/**
 * Dashboard session gate: nothing under /dashboard paints until the session
 * read settles; a signed-out visitor is replaced to the landing page.
 */
export function useRequireAuth(): { user: AuthUser | null; checked: boolean } {
  const router = useRouter();
  const [state, setState] = useState<{
    user: AuthUser | null;
    checked: boolean;
  }>({ user: null, checked: false });

  useEffect(() => {
    const t = window.setTimeout(() => {
      const user = readSession();
      setState({ user, checked: true });
      if (!user) router.replace("/");
    }, 0);
    return () => window.clearTimeout(t);
  }, [router]);

  return state;
}
