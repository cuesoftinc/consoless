import { describe, expect, it, vi } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import { useRequest } from "./use-request";

describe("useRequest", () => {
  it("loads, then exposes the data", async () => {
    const { result } = renderHook(() => useRequest(async () => ["a", "b"]));
    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.data).toEqual(["a", "b"]);
    expect(result.current.error).toBeNull();
  });

  it("exposes the error and keeps data null when the fetch fails", async () => {
    const { result } = renderHook(() =>
      useRequest<string[]>(async () => {
        throw new Error("boom");
      }),
    );
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error?.message).toBe("boom");
    expect(result.current.data).toBeNull();
  });

  it("re-runs the fetch on reload and when deps change", async () => {
    const fn = vi.fn(async (id: string) => id);
    const { result, rerender } = renderHook(
      ({ id }) => useRequest(() => fn(id), [id]),
      { initialProps: { id: "one" } },
    );
    await waitFor(() => expect(result.current.data).toBe("one"));

    rerender({ id: "two" });
    await waitFor(() => expect(result.current.data).toBe("two"));

    await act(async () => {
      await result.current.reload();
    });
    expect(fn).toHaveBeenCalledTimes(3);
  });
});
