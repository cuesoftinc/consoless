import type { AuthProvider, AuthUser } from "./provider";

// TEST_MODE session keys are `<product>.test-session`.
const SESSION_KEY = "consoless.test-session";

const TEST_USER: AuthUser = {
  id: "usr_playerone",
  name: "PlayerOne",
  email: "player@example.com",
};

/** No network: the Google button establishes a deterministic local session. */
export class TestModeAuthProvider implements AuthProvider {
  async signInWithGoogle(): Promise<AuthUser> {
    const user = TEST_USER;
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
