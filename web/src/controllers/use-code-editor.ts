"use client";

/**
 * The Code tab: a version's code, a draft of the user's edits, and the
 * check an edit goes through before it becomes a version (CON-007). A
 * failed edit keeps the user's text and names the line.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { newIdempotencyKey } from "@/lib/idempotency";
import { ApiError, GAME_FILE, type Check } from "@/models";
import { studioRepo } from "@/models/repositories";
import { useToast } from "./toast";
import { useRequest } from "./use-request";

export const CHECK_POLL_MS = 1000;

export interface CodeEditorController {
  /** The text in the editor: the draft, or the version's code. */
  content: string;
  loading: boolean;
  failed: boolean;
  /** The user has changed the code and not saved it. */
  dirty: boolean;
  setContent: (content: string) => void;
  /** Throws the edits away. */
  discard: () => void;
  /** True from Save until the check settles. */
  checking: boolean;
  /** Where the last save failed its check. */
  checkError: Check["error"];
  /** A message when the save could not be sent at all. */
  saveError: string | null;
  save: () => Promise<void>;
}

export function useCodeEditorController(
  projectId: string,
  versionId: string | null,
  /** Called once an edit has become a new version. */
  onSaved: () => Promise<void> | void,
): CodeEditorController {
  const { addToast } = useToast();
  const request = useRequest(
    () => (versionId ? studioRepo.version(versionId) : Promise.resolve(null)),
    [versionId],
  );
  const [draft, setDraft] = useState<{
    versionId: string;
    text: string;
  } | null>(null);
  const [check, setCheck] = useState<Check | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const original =
    request.data?.files.find((file) => file.path === GAME_FILE)?.content ?? "";
  // A draft belongs to the version it was typed against.
  const ownDraft = draft && draft.versionId === versionId ? draft.text : null;
  const content = ownDraft ?? original;
  const dirty = ownDraft !== null && ownDraft !== original;

  const setContent = useCallback(
    (text: string) => {
      if (versionId) setDraft({ versionId, text });
    },
    [versionId],
  );

  const discard = useCallback(() => {
    setDraft(null);
    setCheck(null);
    setSaveError(null);
  }, []);

  const checkId = check?.status === "checking" ? check.id : null;
  const onSavedRef = useRef(onSaved);
  useEffect(() => {
    onSavedRef.current = onSaved;
  });

  useEffect(() => {
    if (!checkId) return;
    const timer = setInterval(() => {
      void (async () => {
        try {
          const next = await studioRepo.check(checkId);
          if (next.status === "checking") return;
          setCheck(next);
          if (next.status === "passed") {
            setDraft(null);
            addToast(
              "Your edit passed its checks and is a new version.",
              "success",
            );
            await onSavedRef.current();
          }
        } catch {
          // A failed poll is retried on the next tick.
        }
      })();
    }, CHECK_POLL_MS);
    return () => clearInterval(timer);
  }, [addToast, checkId]);

  const save = useCallback(async () => {
    if (!dirty || sending || checkId) return;
    setSending(true);
    setSaveError(null);
    setCheck(null);
    try {
      setCheck(
        await studioRepo.saveCode(projectId, content, newIdempotencyKey()),
      );
    } catch (error) {
      setSaveError(
        error instanceof ApiError && error.status < 500
          ? error.message
          : "We could not save your edit. Try again.",
      );
    } finally {
      setSending(false);
    }
  }, [checkId, content, dirty, projectId, sending]);

  return {
    content,
    loading: request.loading,
    failed: request.error !== null,
    dirty,
    setContent,
    discard,
    checking: sending || checkId !== null,
    checkError: check?.status === "failed" ? check.error : null,
    saveError,
    save,
  };
}
