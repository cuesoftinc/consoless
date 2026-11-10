"use client";

import { useCallback } from "react";
import { trackEvent, usePageView } from "./use-analytics";
import { useGithubStarsController } from "./use-github-stars";

export interface HomeController {
  /** Live GitHub star count; null renders the neutral "Star". */
  stars: number | null;
  onTryCloud: () => void;
  onSelfHost: () => void;
  onGithub: () => void;
  onContribute: () => void;
  onDemo: (style: string) => void;
  onFaqOpen: (index: number) => void;
  onNavLink: (id: string) => void;
}

/** Landing-page orchestration: the star count and the event register. */
export function useHomeController(): HomeController {
  usePageView("home");
  const { stars } = useGithubStarsController();

  const onTryCloud = useCallback(() => trackEvent("try_cloud_click"), []);
  const onSelfHost = useCallback(() => trackEvent("self_host_click"), []);
  const onGithub = useCallback(() => trackEvent("github_click"), []);
  const onContribute = useCallback(() => trackEvent("contribute_click"), []);
  const onDemo = useCallback(
    (style: string) => trackEvent("demo_interact", { style }),
    [],
  );
  const onFaqOpen = useCallback(
    (index: number) => trackEvent("faq_open", { question: String(index + 1) }),
    [],
  );
  const onNavLink = useCallback((id: string) => {
    if (id === "try-cloud" || id === "sign-in") trackEvent("try_cloud_click");
    else if (id === "github") trackEvent("github_click");
  }, []);

  return {
    stars,
    onTryCloud,
    onSelfHost,
    onGithub,
    onContribute,
    onDemo,
    onFaqOpen,
    onNavLink,
  };
}
