"use client";

/**
 * Analytics controller: the docs/pages.md Part A event register. Payloads
 * are event names with coarse string dimensions only, never prompts, code
 * or anything a person typed.
 *
 * TEST_MODE-safe seam: every event lands on an in-page queue
 * (window.__consolessEvents) that tests can read. The network beacon fires
 * only outside TEST_MODE and only when the shared analytics endpoint is
 * configured (NEXT_PUBLIC_UPSTAT_EVENTS_URL). That endpoint does not exist
 * yet (S-23), so the default build is queue-only.
 */

import { useCallback, useEffect } from "react";
import { env } from "@/config/env";

export type AnalyticsEvent =
  | "page_view"
  | "try_cloud_click"
  | "self_host_click"
  | "github_click"
  | "demo_interact"
  | "contribute_click"
  | "faq_open";

/** Coarse dimensions only. */
export type AnalyticsProps = Record<string, string>;

export interface AnalyticsRecord {
  event: AnalyticsEvent;
  props: AnalyticsProps;
  ts: number;
}

declare global {
  interface Window {
    __consolessEvents?: AnalyticsRecord[];
  }
}

const QUEUE_LIMIT = 200;

export function trackEvent(
  event: AnalyticsEvent,
  props: AnalyticsProps = {},
): void {
  if (typeof window === "undefined") return;
  const record: AnalyticsRecord = { event, props, ts: Date.now() };

  const queue = (window.__consolessEvents ??= []);
  queue.push(record);
  if (queue.length > QUEUE_LIMIT) queue.splice(0, queue.length - QUEUE_LIMIT);

  const url = env.analyticsUrl;
  if (!env.testMode && url && typeof navigator.sendBeacon === "function") {
    navigator.sendBeacon(url, JSON.stringify(record));
  }
}

export interface AnalyticsController {
  track: (event: AnalyticsEvent, props?: AnalyticsProps) => void;
}

export function useAnalyticsController(): AnalyticsController {
  return {
    track: useCallback(
      (event: AnalyticsEvent, props: AnalyticsProps = {}) =>
        trackEvent(event, props),
      [],
    ),
  };
}

/** Emits `page_view` once per mount. */
export function usePageView(page: string): void {
  useEffect(() => {
    trackEvent("page_view", { page });
  }, [page]);
}
