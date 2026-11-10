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
  onCopyCommand: (method: string) => void;
  onFaqOpen: (index: number) => void;
  onNavLink: (id: string) => void;
}

/** Landing-page orchestration: the star count and the event register. */
export function useHomeController(): HomeController {
  usePageView("home");
  const { stars } = useGithubStarsController();

  const onTryCloud = useCallback(() => trackEvent("try_cloud_click"), []);
  const onSelfHost = useCallback(() => trackEvent("self_host_click"), []);
  const onCopyCommand = useCallback(
    (method: string) =>
      trackEvent("self_host_click", { target: "copy", method }),
    [],
  );
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
    onCopyCommand,
    onGithub,
    onContribute,
    onDemo,
    onFaqOpen,
    onNavLink,
  };
}
