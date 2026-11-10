import { getExternalJson } from "./client";

/** Public GitHub repository data. */
export const githubRepo = {
  /** The repository's star count, or null when it cannot be read. */
  async stars(repo: string): Promise<number | null> {
    const data = await getExternalJson<{ stargazers_count?: unknown }>(
      `https://api.github.com/repos/${repo}`,
    );
    return typeof data?.stargazers_count === "number"
      ? data.stargazers_count
      : null;
  },
};
