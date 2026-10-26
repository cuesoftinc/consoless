"use client";

import React from "react";
import { useRequireAuth } from "@/controllers/auth";

/** Renders the dashboard only once a session is confirmed. */
const AuthGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, checked } = useRequireAuth();
  if (!checked || !user) {
    return <div className="h-screen bg-gaming-900" aria-busy="true" />;
  }
  return <>{children}</>;
};

export default AuthGate;
