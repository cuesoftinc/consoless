"use client";

/** Settings: the profile name and account deletion (CON-014). */

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuthProvider } from "@/auth";
import { ApiError } from "@/models";
import { meRepo } from "@/models/repositories";
import { useMe } from "./me-context";
import { useToast } from "./toast";

export interface SettingsController {
  saving: boolean;
  /** A message under the display-name field when saving failed. */
  nameError: string | null;
  saveDisplayName: (name: string) => Promise<void>;
  deleting: boolean;
  deleteError: string | null;
  deleteAccount: () => Promise<void>;
}

export function useSettingsController(): SettingsController {
  const router = useRouter();
  const { setMe } = useMe();
  const { addToast } = useToast();
  const [saving, setSaving] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const saveDisplayName = useCallback(
    async (name: string) => {
      setSaving(true);
      setNameError(null);
      try {
        setMe(await meRepo.rename(name));
        addToast("Profile saved.", "success");
      } catch (error) {
        setNameError(
          error instanceof ApiError && error.status < 500
            ? error.message
            : "We could not save your profile. Try again.",
        );
      } finally {
        setSaving(false);
      }
    },
    [addToast, setMe],
  );

  const deleteAccount = useCallback(async () => {
    setDeleting(true);
    setDeleteError(null);
    try {
      await meRepo.remove();
      await getAuthProvider().signOut();
      router.replace("/");
    } catch {
      setDeleteError("We could not delete your account. Try again.");
      setDeleting(false);
    }
  }, [router]);

  return {
    saving,
    nameError,
    saveDisplayName,
    deleting,
    deleteError,
    deleteAccount,
  };
}
