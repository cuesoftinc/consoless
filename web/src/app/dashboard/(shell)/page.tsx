import type { Metadata } from "next";
import DashboardHub from "@/components/dashboard/DashboardHub";

export const metadata: Metadata = { title: "Hub" };

export default function HubPage() {
  return <DashboardHub />;
}
