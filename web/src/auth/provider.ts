/**
 * AuthProvider: the seam behind the landing page's log-in and sign-up form.
 * TestModeAuthProvider is the only provider until the backend lands; a real
 * provider slots in behind the same interface.
 */
export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export interface AuthProvider {
  /** Resolves once a session exists. */
  signIn(email: string): Promise<AuthUser>;
  signOut(): Promise<void>;
  /** Synchronous snapshot of the current session; null on any failure. */
  currentUser(): AuthUser | null;
}
