"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuthProvider, type AuthUser } from "@/auth";

function readSession(): AuthUser | null {
  try {
    return getAuthProvider().currentUser();
  } catch {
    return null;
  }
}

export interface AuthController {
  /** True while the Google sign-in is in flight. */
  loading: boolean;
  /** A plain-language message when sign-in did not complete. */
  error: string | null;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

/** Sign-in and sign-out. A successful sign-in opens the dashboard. */
export function useAuthController(): AuthController {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signInWithGoogle = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await getAuthProvider().signInWithGoogle();
      router.push("/dashboard");
    } catch {
      setError("Google sign-in was cancelled or did not finish. Try again.");
      setLoading(false);
    }
  }, [router]);

  const signOut = useCallback(async () => {
    await getAuthProvider().signOut();
    router.push("/signin");
  }, [router]);

  return { loading, error, signInWithGoogle, signOut };
}

interface SessionState {
  user: AuthUser | null;
  checked: boolean;
}

function useSession(onSettled: (user: AuthUser | null) => void): SessionState {
  const [state, setState] = useState<SessionState>({
    user: null,
    checked: false,
  });

  useEffect(() => {
    // Deferred a tick: keeps setState out of the synchronous effect body.
    const t = window.setTimeout(() => {
      const user = readSession();
      setState({ user, checked: true });
      onSettled(user);
    }, 0);
    return () => window.clearTimeout(t);
  }, [onSettled]);

  return state;
}

/**
 * Dashboard session gate: nothing under /dashboard paints until the session
 * read settles; a signed-out visitor is replaced to /signin.
 */
export function useRequireAuth(): SessionState {
  const router = useRouter();
  const onSettled = useCallback(
    (user: AuthUser | null) => {
      if (!user) router.replace("/signin");
    },
    [router],
  );
  return useSession(onSettled);
}

/**
 * The /signin reverse gate: a signed-in visitor never sees the sign-in
 * screen and is replaced to the dashboard.
 */
export function useRedirectAuthed(): SessionState {
  const router = useRouter();
  const onSettled = useCallback(
    (user: AuthUser | null) => {
      if (user) router.replace("/dashboard");
    },
    [router],
  );
  return useSession(onSettled);
}

const noop = () => {};

/**
 * The session on public pages: no redirect either way. `user` is null for
 * a visitor and while the read is in flight; `checked` tells them apart.
 */
export function useSessionUser(): SessionState {
  return useSession(noop);
}
