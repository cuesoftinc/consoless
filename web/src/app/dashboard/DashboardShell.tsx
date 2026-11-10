"use client";

/**
 * Dashboard shell: the session guard, the signed-in user, the app bar and
 * the one-time age check. Settings stay reachable before the age check, so
 * anyone can manage or delete their account; everything else waits for it.
 */

import { usePathname } from "next/navigation";
import AgeCheck from "@/components/dashboard/AgeCheck";
import AppBar from "@/components/dashboard/AppBar";
import Banner from "@/components/ui/Banner";
import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";
import { useAuthController, useRequireAuth } from "@/controllers/auth";
import { MeProvider, useMe } from "@/controllers/me-context";
import { useAgeCheckController } from "@/controllers/use-age-check";

function AgeCheckGate({ onSignOut }: { onSignOut: () => void }) {
  const ageCheck = useAgeCheckController();
  return (
    <AgeCheck
      step={ageCheck.step}
      saving={ageCheck.saving}
      error={ageCheck.error}
      onConfirm={() => void ageCheck.confirm()}
      onUnder16={ageCheck.declineUnder16}
      onBack={ageCheck.back}
      onSignOut={onSignOut}
    />
  );
}

function ShellChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "/dashboard";
  const { signOut } = useAuthController();
  const { me, loading, error, reload } = useMe();
  const onSignOut = () => void signOut();
  const inSettings = pathname.startsWith("/dashboard/settings");

  let content: React.ReactNode;
  if (me) {
    content =
      me.creator_attested_at || inSettings ? (
        children
      ) : (
        <AgeCheckGate onSignOut={onSignOut} />
      );
  } else if (error && !loading) {
    content = (
      <Banner
        kind="danger"
        action={
          <Button kind="secondary" size="sm" onClick={() => void reload()}>
            Try again
          </Button>
        }
      >
        We could not load your account.
      </Banner>
    );
  } else {
    content = (
      <div
        aria-busy="true"
        aria-label="Loading"
        data-testid="shell-loading"
        className="flex flex-col gap-4"
      >
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-80 max-w-full" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <AppBar me={me} onSignOut={onSignOut} />
      <main
        id="main"
        tabIndex={-1}
        className="mx-auto w-full max-w-312 flex-1 px-4 py-8 outline-none md:px-8"
      >
        {content}
      </main>
    </div>
  );
}

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, checked } = useRequireAuth();
  // Nothing under /dashboard paints until the session read settles.
  if (!checked || !user) {
    return <div className="min-h-screen" aria-busy="true" />;
  }
  return (
    <MeProvider>
      <ShellChrome>{children}</ShellChrome>
    </MeProvider>
  );
}
