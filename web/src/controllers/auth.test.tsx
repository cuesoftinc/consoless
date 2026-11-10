import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import { getAuthProvider } from "@/auth";
import { useAuthController, useRedirectAuthed, useRequireAuth } from "./auth";

const push = vi.fn();
const replace = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push, replace }),
}));

beforeEach(() => {
  push.mockClear();
  replace.mockClear();
  window.sessionStorage.clear();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("useAuthController", () => {
  it("signs in with Google and opens the dashboard", async () => {
    const { result } = renderHook(() => useAuthController());
    await act(async () => {
      await result.current.signInWithGoogle();
    });
    expect(getAuthProvider().currentUser()).not.toBeNull();
    expect(push).toHaveBeenCalledWith("/dashboard");
    expect(result.current.error).toBeNull();
  });

  it("reports a failed sign-in in plain words and stays put", async () => {
    vi.spyOn(getAuthProvider(), "signInWithGoogle").mockRejectedValue(
      new Error("popup closed"),
    );
    const { result } = renderHook(() => useAuthController());
    await act(async () => {
      await result.current.signInWithGoogle();
    });
    expect(result.current.error).toBe(
      "Google sign-in was cancelled or did not finish. Try again.",
    );
    expect(result.current.loading).toBe(false);
    expect(push).not.toHaveBeenCalled();
  });

  it("signs out and returns to the sign-in screen", async () => {
    await getAuthProvider().signInWithGoogle();
    const { result } = renderHook(() => useAuthController());
    await act(async () => {
      await result.current.signOut();
    });
    expect(getAuthProvider().currentUser()).toBeNull();
    expect(push).toHaveBeenCalledWith("/signin");
  });
});

describe("session gates", () => {
  it("useRequireAuth sends a signed-out visitor to /signin", async () => {
    const { result } = renderHook(() => useRequireAuth());
    await waitFor(() => expect(result.current.checked).toBe(true));
    expect(result.current.user).toBeNull();
    expect(replace).toHaveBeenCalledWith("/signin");
  });

  it("useRequireAuth lets a signed-in user through", async () => {
    await getAuthProvider().signInWithGoogle();
    const { result } = renderHook(() => useRequireAuth());
    await waitFor(() => expect(result.current.checked).toBe(true));
    expect(result.current.user).not.toBeNull();
    expect(replace).not.toHaveBeenCalled();
  });

  it("useRedirectAuthed sends a signed-in visitor to the dashboard", async () => {
    await getAuthProvider().signInWithGoogle();
    const { result } = renderHook(() => useRedirectAuthed());
    await waitFor(() => expect(result.current.checked).toBe(true));
    expect(replace).toHaveBeenCalledWith("/dashboard");
  });

  it("useRedirectAuthed leaves a signed-out visitor on the page", async () => {
    const { result } = renderHook(() => useRedirectAuthed());
    await waitFor(() => expect(result.current.checked).toBe(true));
    expect(replace).not.toHaveBeenCalled();
  });
});
