import type { AuthProvider, AuthUser } from "./provider";

// TEST_MODE session keys are `<product>.test-session`.
const SESSION_KEY = "consoless.test-session";

/**
 * Playwright can choose which test user the Google button signs in by
 * setting this localStorage key to a user id (`usr_...`) before the click.
 * The mock server keeps state per user id, and ids beginning `usr_new` are
 * first-time users. Unset, the returning creator below signs in.
 */
export const TEST_USER_KEY = "consoless.test-user";

const DEFAULT_USER: AuthUser = {
  id: "usr_playerone",
  name: "Player One",
  email: "playerone@example.com",
};

function chosenUser(): AuthUser {
  if (typeof window === "undefined") return DEFAULT_USER;
  let id: string | null = null;
  try {
    id = window.localStorage.getItem(TEST_USER_KEY);
  } catch {
    id = null;
  }
  if (!id || !/^usr_[a-z0-9_]+$/.test(id)) return DEFAULT_USER;
  const handle = id.replace(/^usr_/, "");
  return {
    id,
    name: id.startsWith("usr_new") ? "New Player" : "Player One",
    email: `${handle}@example.com`,
  };
}

/** No network: the Google button establishes a deterministic local session. */
export class TestModeAuthProvider implements AuthProvider {
  async signInWithGoogle(): Promise<AuthUser> {
    const user = chosenUser();
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

  async getBearerToken(): Promise<string | null> {
    const user = this.currentUser();
    return user ? `test-mode-token.${user.id}` : null;
  }
}
