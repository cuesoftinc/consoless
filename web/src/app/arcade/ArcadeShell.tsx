"use client";

import ArcadeBar from "@/components/arcade/ArcadeBar";
import { useSessionUser } from "@/controllers/auth";

export default function ArcadeShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, checked } = useSessionUser();
  return (
    <div className="flex min-h-screen flex-col">
      <ArcadeBar signedIn={checked ? user !== null : null} />
      <main
        id="main"
        tabIndex={-1}
        className="mx-auto w-full max-w-312 flex-1 px-4 py-8 outline-none md:px-8"
      >
        {children}
      </main>
    </div>
  );
}
