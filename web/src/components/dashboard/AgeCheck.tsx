/**
 * AgeCheck: the one-time 16-or-older question creators answer before they
 * can make games (S-15). Render-only; `useAgeCheckController` owns state.
 */

import Banner from "@/components/ui/Banner";
import Button from "@/components/ui/Button";
import type { AgeCheckStep } from "@/controllers/use-age-check";

export interface AgeCheckProps {
  step: AgeCheckStep;
  saving: boolean;
  error: string | null;
  onConfirm: () => void;
  onUnder16: () => void;
  onBack: () => void;
  onSignOut: () => void;
}

export default function AgeCheck({
  step,
  saving,
  error,
  onConfirm,
  onUnder16,
  onBack,
  onSignOut,
}: AgeCheckProps) {
  return (
    <section
      data-testid="age-check"
      data-step={step}
      className="mx-auto flex w-full max-w-120 flex-col gap-4 rounded-xl border border-border-default bg-bg-raised p-8"
    >
      {step === "ask" ? (
        <>
          <h1 className="text-heading-lg text-text-primary">One quick check</h1>
          <p className="text-body-md text-text-secondary">
            You need to be 16 or older to make games on Consoless. We ask once,
            and we do not ask for your date of birth.
          </p>
          {error ? <Banner kind="danger">{error}</Banner> : null}
          <div className="flex flex-wrap gap-3 pt-2">
            <Button onClick={onConfirm} loading={saving}>
              I am 16 or older
            </Button>
            <Button kind="ghost" onClick={onUnder16} disabled={saving}>
              I am under 16
            </Button>
          </div>
        </>
      ) : (
        <>
          <h1 className="text-heading-lg text-text-primary">
            You can still play
          </h1>
          <p className="text-body-md text-text-secondary">
            Making games is for people aged 16 and over. Published games are
            open to everyone, and playing them needs no account.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Button kind="secondary" onClick={onBack}>
              Back
            </Button>
            <Button kind="ghost" onClick={onSignOut}>
              Sign out
            </Button>
          </div>
        </>
      )}
    </section>
  );
}
