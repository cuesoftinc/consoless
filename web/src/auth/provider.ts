/**
 * AuthProvider: the seam behind the single "Continue with Google" CTA.
 * Google sign-in is the only credential. TestModeAuthProvider is the only
 * provider until the backend lands; FirebaseAuthProvider (Google-only) slots
 * in behind the same interface.
 */
export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export interface AuthProvider {
  /** Runs the Google sign-in flow; resolves once a session exists. */
  signInWithGoogle(): Promise<AuthUser>;
  signOut(): Promise<void>;
  /** Synchronous snapshot of the current session; null on any failure. */
  currentUser(): AuthUser | null;
}
