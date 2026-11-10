import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { getAuthProvider } from "@/auth";
import { ApiError, type Me } from "@/models";
import { meRepo } from "@/models/repositories";
import { MeProvider, useMe } from "./me-context";
import { ToastProvider, useToast } from "./toast";
import { useAgeCheckController } from "./use-age-check";
import { useSettingsController } from "./use-settings";

const replace = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace }),
}));

vi.mock("@/models/repositories", () => ({
  meRepo: {
    get: vi.fn(),
    rename: vi.fn(),
    attest: vi.fn(),
    remove: vi.fn(),
  },
}));

const repo = vi.mocked(meRepo);

const ME: Me = {
  id: "usr_new_1",
  email: "new_1@example.com",
  display_name: "New Player",
  username: "new_1",
  creator_attested_at: null,
  created_at: "2026-11-10T00:00:00.000Z",
  quota: { limit: 20, used: 0, resets_at: "2026-11-11T00:00:00.000Z" },
};

const wrapper = ({ children }: { children: ReactNode }) => (
  <ToastProvider>
    <MeProvider>{children}</MeProvider>
  </ToastProvider>
);

function setup() {
  return renderHook(
    () => ({
      me: useMe(),
      age: useAgeCheckController(),
      settings: useSettingsController(),
      toast: useToast(),
    }),
    { wrapper },
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  window.sessionStorage.clear();
  repo.get.mockResolvedValue(ME);
});

describe("MeProvider", () => {
  it("loads the signed-in user once", async () => {
    const { result } = setup();
    expect(result.current.me.me).toBeNull();
    await waitFor(() => expect(result.current.me.me).toEqual(ME));
    expect(repo.get).toHaveBeenCalledTimes(1);
  });

  it("surfaces a failed load and recovers on reload", async () => {
    repo.get.mockRejectedValueOnce(new Error("offline"));
    const { result } = setup();
    await waitFor(() => expect(result.current.me.error).not.toBeNull());
    await act(async () => {
      await result.current.me.reload();
    });
    expect(result.current.me.me).toEqual(ME);
    expect(result.current.me.error).toBeNull();
  });

  it("throws outside a provider", () => {
    expect(() => renderHook(() => useMe())).toThrow(/MeProvider/);
  });
});

describe("useAgeCheckController", () => {
  it("records the attestation and updates the user", async () => {
    const attested = { ...ME, creator_attested_at: "2026-11-10T01:00:00.000Z" };
    repo.attest.mockResolvedValue(attested);
    const { result } = setup();
    await waitFor(() => expect(result.current.me.me).toEqual(ME));
    await act(async () => {
      await result.current.age.confirm();
    });
    expect(result.current.me.me).toEqual(attested);
    expect(result.current.age.error).toBeNull();
  });

  it("explains a failed save and lets the user retry", async () => {
    repo.attest.mockRejectedValue(new Error("offline"));
    const { result } = setup();
    await waitFor(() => expect(result.current.me.me).toEqual(ME));
    await act(async () => {
      await result.current.age.confirm();
    });
    expect(result.current.age.error).toBe("We could not save that. Try again.");
    expect(result.current.age.saving).toBe(false);
  });

  it("moves to the under-16 step and back without saving anything", async () => {
    const { result } = setup();
    act(() => result.current.age.declineUnder16());
    expect(result.current.age.step).toBe("under-16");
    act(() => result.current.age.back());
    expect(result.current.age.step).toBe("ask");
    expect(repo.attest).not.toHaveBeenCalled();
  });
});

describe("useSettingsController", () => {
  it("saves the display name and toasts", async () => {
    repo.rename.mockResolvedValue({ ...ME, display_name: "Ada" });
    const { result } = setup();
    await waitFor(() => expect(result.current.me.me).toEqual(ME));
    await act(async () => {
      await result.current.settings.saveDisplayName("Ada");
    });
    expect(repo.rename).toHaveBeenCalledWith("Ada");
    expect(result.current.me.me?.display_name).toBe("Ada");
    expect(result.current.toast.toasts.at(-1)?.message).toBe("Profile saved.");
  });

  it("shows the API message for a rejected name and fallback copy otherwise", async () => {
    const { result } = setup();
    await waitFor(() => expect(result.current.me.me).toEqual(ME));

    repo.rename.mockRejectedValueOnce(
      new ApiError(422, { code: "validation_failed", message: "Too long." }),
    );
    await act(async () => {
      await result.current.settings.saveDisplayName("x");
    });
    expect(result.current.settings.nameError).toBe("Too long.");

    repo.rename.mockRejectedValueOnce(new Error("offline"));
    await act(async () => {
      await result.current.settings.saveDisplayName("x");
    });
    expect(result.current.settings.nameError).toBe(
      "We could not save your profile. Try again.",
    );
  });

  it("deletes the account, signs out and goes home", async () => {
    repo.remove.mockResolvedValue(undefined);
    await getAuthProvider().signInWithGoogle();
    const { result } = setup();
    await act(async () => {
      await result.current.settings.deleteAccount();
    });
    expect(repo.remove).toHaveBeenCalled();
    expect(getAuthProvider().currentUser()).toBeNull();
    expect(replace).toHaveBeenCalledWith("/");
  });

  it("keeps the user signed in when deletion fails", async () => {
    repo.remove.mockRejectedValue(new Error("offline"));
    await getAuthProvider().signInWithGoogle();
    const { result } = setup();
    await act(async () => {
      await result.current.settings.deleteAccount();
    });
    expect(result.current.settings.deleteError).toBe(
      "We could not delete your account. Try again.",
    );
    expect(result.current.settings.deleting).toBe(false);
    expect(getAuthProvider().currentUser()).not.toBeNull();
    expect(replace).not.toHaveBeenCalled();
  });
});
