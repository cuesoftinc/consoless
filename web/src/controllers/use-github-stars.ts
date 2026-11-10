"use client";

/**
 * GitHub stars controller. The star count is fetched at runtime and never
 * written into copy. It stays null (callers show the neutral "Star") in
 * TEST_MODE and whenever the fetch fails.
 */

import { useEffect, useState } from "react";
import { env } from "@/config/env";
import { githubRepo } from "@/models/repositories";

export const GITHUB_REPO = "cuesoftinc/consoless";

/** Module cache: one fetch per page session. */
let cachedStars: number | null | undefined;

/** Test seam. */
export function resetGithubStarsCache(): void {
  cachedStars = undefined;
}

export interface GithubStarsController {
  /** null means unknown: render the neutral "Star". */
  stars: number | null;
}

export function useGithubStarsController(
  repo: string = GITHUB_REPO,
): GithubStarsController {
  const [stars, setStars] = useState<number | null>(
    typeof cachedStars === "number" ? cachedStars : null,
  );

  useEffect(() => {
    if (env.testMode || cachedStars !== undefined) return;
    let cancelled = false;
    githubRepo
      .stars(repo)
      .then((count) => {
        cachedStars = count;
        if (!cancelled && count !== null) setStars(count);
      })
      .catch(() => {
        cachedStars = null;
      });
    return () => {
      cancelled = true;
    };
  }, [repo]);

  return { stars };
}
