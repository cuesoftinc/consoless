"use client";

/**
 * The one-time 16-or-older check for creators (S-15, P-12). Confirming
 * records the attestation. Answering "under 16" records nothing: it only
 * changes what this screen shows.
 */

import { useCallback, useState } from "react";
import { meRepo } from "@/models/repositories";
import { useMe } from "./me-context";

export type AgeCheckStep = "ask" | "under-16";

export interface AgeCheckController {
  step: AgeCheckStep;
  saving: boolean;
  error: string | null;
  confirm: () => Promise<void>;
  declineUnder16: () => void;
  back: () => void;
}

export function useAgeCheckController(): AgeCheckController {
  const { setMe } = useMe();
  const [step, setStep] = useState<AgeCheckStep>("ask");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const confirm = useCallback(async () => {
    setSaving(true);
    setError(null);
    try {
      setMe(await meRepo.attest());
    } catch {
      setError("We could not save that. Try again.");
    } finally {
      setSaving(false);
    }
  }, [setMe]);

  return {
    step,
    saving,
    error,
    confirm,
    declineUnder16: () => setStep("under-16"),
    back: () => setStep("ask"),
  };
}
