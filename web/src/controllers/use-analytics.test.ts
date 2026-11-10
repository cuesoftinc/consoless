import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import {
  trackEvent,
  useAnalyticsController,
  usePageView,
} from "./use-analytics";

beforeEach(() => {
  window.__consolessEvents = undefined;
});

describe("analytics", () => {
  it("queues events in the page with coarse props only", () => {
    trackEvent("faq_open", { question: "1" });
    expect(window.__consolessEvents).toHaveLength(1);
    expect(window.__consolessEvents?.[0]).toMatchObject({
      event: "faq_open",
      props: { question: "1" },
    });
  });

  it("never beacons in TEST_MODE", () => {
    const sendBeacon = vi.fn();
    Object.defineProperty(navigator, "sendBeacon", {
      value: sendBeacon,
      configurable: true,
    });
    trackEvent("try_cloud_click");
    expect(sendBeacon).not.toHaveBeenCalled();
  });

  it("caps the queue at 200 records", () => {
    for (let i = 0; i < 205; i += 1) trackEvent("demo_interact");
    expect(window.__consolessEvents).toHaveLength(200);
  });

  it("usePageView emits one page_view per mount", () => {
    renderHook(() => usePageView("home"));
    expect(window.__consolessEvents).toEqual([
      expect.objectContaining({ event: "page_view", props: { page: "home" } }),
    ]);
  });

  it("the controller's track is stable across renders", () => {
    const { result, rerender } = renderHook(() => useAnalyticsController());
    const first = result.current.track;
    rerender();
    expect(result.current.track).toBe(first);
  });
});
