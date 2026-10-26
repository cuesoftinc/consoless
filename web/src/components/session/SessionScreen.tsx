"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import ActiveSession from "./ActiveSession";
import { useAppState } from "@/controllers/app-state";

/** The stream view; without a running session it returns to the hub. */
const SessionScreen: React.FC = () => {
  const router = useRouter();
  const { currentSession, endSession } = useAppState();

  useEffect(() => {
    if (!currentSession) router.replace("/dashboard");
  }, [currentSession, router]);

  if (!currentSession) return null;
  return <ActiveSession session={currentSession} onEndSession={endSession} />;
};

export default SessionScreen;
