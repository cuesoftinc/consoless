"use client";

import React, { createContext, useCallback, useContext, useState } from "react";
import { useRouter } from "next/navigation";
import type { ConsoleModel, Session } from "@/models/types";

const INITIAL_WALLET_BALANCE = 42.5;

interface AppState {
  walletBalance: number;
  addFunds: (amount: number) => void;
  currentSession: Session | null;
  startSession: (consoleModel: ConsoleModel, gameId: string) => void;
  endSession: () => void;
  playGame: (gameId: string) => void;
}

const AppStateContext = createContext<AppState | undefined>(undefined);

export function useAppState(): AppState {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error("useAppState must be used within an AppStateProvider");
  }
  return context;
}

/** Dashboard-wide state that outlives route changes: wallet and session. */
export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const router = useRouter();
  const [walletBalance, setWalletBalance] = useState(INITIAL_WALLET_BALANCE);
  const [currentSession, setCurrentSession] = useState<Session | null>(null);

  const addFunds = useCallback((amount: number) => {
    setWalletBalance((prev) => prev + amount);
  }, []);

  const startSession = useCallback(
    (consoleModel: ConsoleModel, gameId: string) => {
      setCurrentSession({
        id: Date.now().toString(),
        consoleId: consoleModel.id,
        gameId,
        startTime: Date.now(),
        isPartyMode: false,
        chatLog: [],
      });
      router.push("/dashboard/session");
    },
    [router],
  );

  const endSession = useCallback(() => {
    setCurrentSession(null);
    router.push("/dashboard");
  }, [router]);

  const playGame = useCallback(
    (gameId: string) => {
      router.push(`/dashboard/rentals?game=${encodeURIComponent(gameId)}`);
    },
    [router],
  );

  return (
    <AppStateContext.Provider
      value={{
        walletBalance,
        addFunds,
        currentSession,
        startSession,
        endSession,
        playGame,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
};
