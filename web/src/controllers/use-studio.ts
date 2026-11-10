"use client";

/**
 * The Studio for one project: the chat of prompts and outcomes, the
 * versions, the console style and publishing. While a generation is in
 * flight its status row is polled every two seconds (S-11, MI-9).
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { newIdempotencyKey } from "@/lib/idempotency";
import {
  ApiError,
  type ConsoleStyleId,
  type Generation,
  type Project,
  type Version,
} from "@/models";
import { studioRepo } from "@/models/repositories";
import { useMe } from "./me-context";
import { useToast } from "./toast";
import { useRequest } from "./use-request";

export const POLL_MS = 2000;

const IN_FLIGHT = new Set(["queued", "generating", "checking"]);

export function isInFlight(generation: Generation): boolean {
  return IN_FLIGHT.has(generation.status);
}

export interface StudioController {
  project: Project | null;
  loading: boolean;
  /** The project does not exist or belongs to someone else. */
  notFound: boolean;
  failed: boolean;
  reload: () => Promise<void>;

  /** Every prompt and its outcome, oldest first. */
  generations: Generation[];
  /** The generation being built now, if any. */
  active: Generation | null;
  prompt: string;
  setPrompt: (prompt: string) => void;
  /** The prompt box is locked: sending, building, or out of generations. */
  promptDisabled: boolean;
  quotaOut: boolean;
  sendError: string | null;
  send: () => Promise<void>;
  /** Sends the last prompt that failed again. */
  retry: () => Promise<void>;

  /** Newest first. */
  versions: Version[];
  /** The version shown in the workspace: the chosen one, or the head. */
  viewing: Version | null;
  viewingHead: boolean;
  selectVersion: (id: string | null) => void;
  restoring: boolean;
  restore: () => Promise<void>;

  setStyle: (style: ConsoleStyleId) => Promise<void>;

  publishOpen: boolean;
  openPublish: () => void;
  closePublish: () => void;
  publishing: boolean;
  publishError: string | null;
  publish: () => Promise<void>;
}

function messageOf(error: unknown, fallback: string): string {
  return error instanceof ApiError && error.status < 500
    ? error.message
    : fallback;
}

export function useStudioController(projectId: string): StudioController {
  const { me, reload: reloadMe } = useMe();
  const { addToast } = useToast();
  const projectRequest = useRequest(
    () => studioRepo.project(projectId),
    [projectId],
  );
  const generationsRequest = useRequest(
    () => studioRepo.generations(projectId),
    [projectId],
  );
  const versionsRequest = useRequest(
    () => studioRepo.versions(projectId),
    [projectId],
  );

  /** The polled copy of the in-flight generation, newer than the list. */
  const [live, setLive] = useState<Generation | null>(null);
  const [projectOverride, setProjectOverride] = useState<Project | null>(null);
  const [prompt, setPrompt] = useState("");
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [restoring, setRestoring] = useState(false);
  const [publishOpen, setPublishOpen] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);

  const { reload: reloadProject } = projectRequest;
  const { reload: reloadGenerations } = generationsRequest;
  const { reload: reloadVersions } = versionsRequest;
  const reloadAll = useCallback(async () => {
    setProjectOverride(null);
    await Promise.all([reloadProject(), reloadGenerations(), reloadVersions()]);
  }, [reloadGenerations, reloadProject, reloadVersions]);

  const listed = generationsRequest.data ?? [];
  const generations = live
    ? listed.some((item) => item.id === live.id)
      ? listed.map((item) => (item.id === live.id ? live : item))
      : [...listed, live]
    : listed;
  const active = generations.find(isInFlight) ?? null;
  const activeId = active?.id ?? null;

  // Poll the in-flight generation until it settles, then refresh
  // everything it may have changed.
  const settling = useRef(false);
  useEffect(() => {
    if (!activeId) return;
    const timer = setInterval(() => {
      if (settling.current) return;
      void (async () => {
        try {
          const next = await studioRepo.generation(activeId);
          setLive(next);
          if (!isInFlight(next)) {
            settling.current = true;
            setSelectedId(null);
            await Promise.all([reloadAll(), reloadMe()]);
            settling.current = false;
          }
        } catch {
          // A failed poll is retried on the next tick.
        }
      })();
    }, POLL_MS);
    return () => clearInterval(timer);
  }, [activeId, reloadAll, reloadMe]);

  const quotaOut = me ? me.quota.used >= me.quota.limit : false;

  const submit = useCallback(
    async (text: string) => {
      setSending(true);
      setSendError(null);
      try {
        setLive(
          await studioRepo.generate(projectId, text, newIdempotencyKey()),
        );
        setPrompt("");
        void reloadMe();
      } catch (error) {
        setSendError(messageOf(error, "We could not send that. Try again."));
      } finally {
        setSending(false);
      }
    },
    [projectId, reloadMe],
  );

  const send = useCallback(async () => {
    const text = prompt.trim();
    if (!text || sending || activeId || quotaOut) return;
    await submit(text);
  }, [activeId, prompt, quotaOut, sending, submit]);

  const lastPrompt = generations.at(-1)?.prompt ?? null;
  const lastFailed = generations.at(-1)?.status === "failed";
  const retry = useCallback(async () => {
    if (!lastFailed || !lastPrompt || sending || quotaOut) return;
    await submit(lastPrompt);
  }, [lastFailed, lastPrompt, quotaOut, sending, submit]);

  const versions = versionsRequest.data ?? [];
  const project = projectOverride ?? projectRequest.data;
  const head = versions[0] ?? null;
  const viewing = versions.find((version) => version.id === selectedId) ?? head;
  const viewingHead = viewing !== null && viewing.id === head?.id;
  const viewingId = viewing?.id ?? null;

  const restore = useCallback(async () => {
    if (!viewingId || viewingHead || restoring) return;
    setRestoring(true);
    try {
      const restored = await studioRepo.restore(viewingId);
      setSelectedId(null);
      addToast(
        `${restored.summary}. It is now version ${restored.number}.`,
        "success",
      );
      await reloadAll();
    } catch (error) {
      addToast(
        messageOf(error, "We could not restore that version. Try again."),
        "error",
      );
    } finally {
      setRestoring(false);
    }
  }, [addToast, reloadAll, restoring, viewingHead, viewingId]);

  const setStyle = useCallback(
    async (style: ConsoleStyleId) => {
      try {
        setProjectOverride(await studioRepo.setStyle(projectId, style));
      } catch (error) {
        addToast(
          messageOf(error, "We could not switch the style. Try again."),
          "error",
        );
      }
    },
    [addToast, projectId],
  );

  const publish = useCallback(async () => {
    setPublishing(true);
    setPublishError(null);
    try {
      setProjectOverride(
        await studioRepo.publish(projectId, newIdempotencyKey()),
      );
      setPublishOpen(false);
      addToast(
        "Sent for review. We will publish it once it passes.",
        "success",
      );
    } catch (error) {
      setPublishError(
        messageOf(error, "We could not send the game for review. Try again."),
      );
    } finally {
      setPublishing(false);
    }
  }, [addToast, projectId]);

  const error = projectRequest.error;
  const notFound = error instanceof ApiError && error.status === 404;

  return {
    project,
    loading: projectRequest.loading,
    notFound,
    failed: error !== null && !notFound,
    reload: reloadAll,
    generations,
    active,
    prompt,
    setPrompt,
    promptDisabled: sending || active !== null || quotaOut,
    quotaOut,
    sendError,
    send,
    retry,
    versions,
    viewing,
    viewingHead,
    selectVersion: setSelectedId,
    restoring,
    restore,
    setStyle,
    publishOpen,
    openPublish: () => {
      setPublishError(null);
      setPublishOpen(true);
    },
    closePublish: () => setPublishOpen(false),
    publishing,
    publishError,
    publish,
  };
}
