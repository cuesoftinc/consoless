"use client";

/**
 * The Arcade: published games, with a search box and a console-style
 * filter. Typing is debounced so each keystroke is not a request.
 */

import { useEffect, useState } from "react";
import type { ArcadeGame, ConsoleStyleId } from "@/models";
import { arcadeRepo } from "@/models/repositories";
import { useRequest } from "./use-request";

export const SEARCH_DEBOUNCE_MS = 250;

export interface ArcadeController {
  games: ArcadeGame[];
  loading: boolean;
  failed: boolean;
  reload: () => Promise<void>;
  /** The text in the search box. */
  query: string;
  setQuery: (query: string) => void;
  /** null means every style. */
  style: ConsoleStyleId | null;
  setStyle: (style: ConsoleStyleId | null) => void;
  /** True when a search or a style filter is narrowing the list. */
  filtered: boolean;
  clearFilters: () => void;
}

export interface ArcadeControllerOptions {
  /** TEST_MODE only: ask the mock for a failure. */
  fail?: boolean;
}

export function useArcadeController(
  options: ArcadeControllerOptions = {},
): ArcadeController {
  const fail = options.fail ?? false;
  const [query, setQuery] = useState("");
  const [applied, setApplied] = useState("");
  const [style, setStyle] = useState<ConsoleStyleId | null>(null);

  useEffect(() => {
    const next = query.trim();
    const timer = setTimeout(() => setApplied(next), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [query]);

  const request = useRequest(
    () => arcadeRepo.list({ q: applied, style, fail }),
    [applied, style, fail],
  );

  return {
    games: request.data?.items ?? [],
    loading: request.loading,
    failed: request.error !== null,
    reload: request.reload,
    query,
    setQuery,
    style,
    setStyle,
    filtered: applied !== "" || style !== null,
    clearFilters: () => {
      setQuery("");
      setApplied("");
      setStyle(null);
    },
  };
}
