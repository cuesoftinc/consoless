import type { Metadata } from "next";
import SessionScreen from "@/components/session/SessionScreen";

export const metadata: Metadata = { title: "Active Session" };

export default function SessionPage() {
  return (
    <main id="main" tabIndex={-1}>
      <SessionScreen />
    </main>
  );
}
