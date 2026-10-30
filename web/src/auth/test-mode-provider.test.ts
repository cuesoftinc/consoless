import { afterEach, describe, expect, it } from "vitest";
import { TestModeAuthProvider } from "./test-mode-provider";

afterEach(() => {
  window.sessionStorage.clear();
});

describe("TestModeAuthProvider", () => {
  it("keeps the session in sessionStorage until sign-out", async () => {
    const provider = new TestModeAuthProvider();
    expect(provider.currentUser()).toBeNull();

    const user = await provider.signInWithGoogle();

    expect(user.email).toBe("player@example.com");
    expect(
      window.sessionStorage.getItem("consoless.test-session"),
    ).not.toBeNull();
    expect(provider.currentUser()).toEqual(user);

    await provider.signOut();
    expect(provider.currentUser()).toBeNull();
  });

  it("reads a corrupted session as signed out", () => {
    window.sessionStorage.setItem("consoless.test-session", "{not json");
    expect(new TestModeAuthProvider().currentUser()).toBeNull();
  });
});
