import type { Metadata } from "next";
import RouteTabs from "@/components/ui/RouteTabs";

export const metadata: Metadata = { title: "Settings" };

const TABS = [
  { href: "/dashboard/settings", label: "Profile" },
  { href: "/dashboard/settings/appearance", label: "Appearance" },
  { href: "/dashboard/settings/data-privacy", label: "Data and privacy" },
];

/** Settings: routed tabs (P-06). */
export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-heading-lg text-text-primary">Settings</h1>
      <RouteTabs
        tabs={TABS}
        aria-label="Settings"
        paneClassName="max-w-160 pt-6"
      >
        {children}
      </RouteTabs>
    </div>
  );
}
