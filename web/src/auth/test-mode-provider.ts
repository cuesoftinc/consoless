import type { AuthProvider, AuthUser } from "./provider";

// Fleet canon: TEST_MODE session keys are `<product>.test-session`.
const SESSION_KEY = "consoless.test-session";

/** No network: any credentials establish a deterministic local session. */
export class TestModeAuthProvider implements AuthProvider {
  async signIn(email: string): Promise<AuthUser> {
    const user: AuthUser = { id: "usr_playerone", name: "PlayerOne", email };
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
    }
    return user;
  }

  async signOut(): Promise<void> {
    if (typeof window !== "undefined") {
      window.sessionStorage.removeItem(SESSION_KEY);
    }
  }

  currentUser(): AuthUser | null {
    if (typeof window === "undefined") return null;
    try {
      const raw = window.sessionStorage.getItem(SESSION_KEY);
      return raw ? (JSON.parse(raw) as AuthUser) : null;
    } catch {
      return null;
    }
  }
}
