"use client";

/**
 * The signed-in user for everything under /dashboard. One `GET /me` per
 * shell mount; mutations hand the updated user back through `setMe`.
 */

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Me } from "@/models";
import { meRepo } from "@/models/repositories";
import { useRequest } from "./use-request";

export interface MeContextValue {
  me: Me | null;
  loading: boolean;
  error: Error | null;
  reload: () => Promise<void>;
  /** Replace the cached user after a mutation returned the new one. */
  setMe: (me: Me) => void;
}

const MeContext = createContext<MeContextValue | undefined>(undefined);

export function MeProvider({ children }: { children: ReactNode }) {
  const request = useRequest(() => meRepo.get());
  const [override, setOverride] = useState<Me | null>(null);

  const { reload: requestReload } = request;
  const reload = useCallback(async () => {
    setOverride(null);
    await requestReload();
  }, [requestReload]);

  const value = useMemo<MeContextValue>(
    () => ({
      me: override ?? request.data,
      loading: request.loading,
      error: request.error,
      reload,
      setMe: setOverride,
    }),
    [override, request.data, request.loading, request.error, reload],
  );

  return <MeContext.Provider value={value}>{children}</MeContext.Provider>;
}

export function useMe(): MeContextValue {
  const context = useContext(MeContext);
  if (!context) throw new Error("useMe must be used within a MeProvider");
  return context;
}
