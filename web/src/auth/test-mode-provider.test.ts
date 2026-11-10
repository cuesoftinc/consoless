import { afterEach, describe, expect, it } from "vitest";
import { TEST_USER_KEY, TestModeAuthProvider } from "./test-mode-provider";

afterEach(() => {
  window.sessionStorage.clear();
  window.localStorage.clear();
});

describe("TestModeAuthProvider", () => {
  it("keeps the session in sessionStorage until sign-out", async () => {
    const provider = new TestModeAuthProvider();
    expect(provider.currentUser()).toBeNull();

    const user = await provider.signInWithGoogle();

    expect(user.id).toBe("usr_playerone");
    expect(user.email).toBe("playerone@example.com");
    expect(
      window.sessionStorage.getItem("consoless.test-session"),
    ).not.toBeNull();
    expect(provider.currentUser()).toEqual(user);

    await provider.signOut();
    expect(provider.currentUser()).toBeNull();
  });

  it("hands out a bearer token only while signed in", async () => {
    const provider = new TestModeAuthProvider();
    expect(await provider.getBearerToken()).toBeNull();
    await provider.signInWithGoogle();
    expect(await provider.getBearerToken()).toBe(
      "test-mode-token.usr_playerone",
    );
  });

  it("signs in the test user chosen in localStorage", async () => {
    window.localStorage.setItem(TEST_USER_KEY, "usr_new_42");
    const provider = new TestModeAuthProvider();
    const user = await provider.signInWithGoogle();
    expect(user).toEqual({
      id: "usr_new_42",
      name: "New Player",
      email: "new_42@example.com",
    });
    expect(await provider.getBearerToken()).toBe("test-mode-token.usr_new_42");
  });

  it("ignores a chosen id that is not a user id", async () => {
    window.localStorage.setItem(TEST_USER_KEY, "../admin");
    const user = await new TestModeAuthProvider().signInWithGoogle();
    expect(user.id).toBe("usr_playerone");
  });

  it("reads a corrupted session as signed out", () => {
    window.sessionStorage.setItem("consoless.test-session", "{not json");
    expect(new TestModeAuthProvider().currentUser()).toBeNull();
  });
});
