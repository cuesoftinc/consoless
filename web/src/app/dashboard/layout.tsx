import AuthGate from "@/components/dashboard/AuthGate";
import { AppStateProvider } from "@/controllers/app-state";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGate>
      <AppStateProvider>{children}</AppStateProvider>
    </AuthGate>
  );
}
