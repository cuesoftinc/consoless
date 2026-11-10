import type { Metadata } from "next";
import DashboardShell from "./DashboardShell";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

/** /dashboard/<area>: the signed-in app. The client shell guards it. */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell>{children}</DashboardShell>;
}
