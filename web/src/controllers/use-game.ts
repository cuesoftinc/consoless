"use client";

/**
 * One Arcade game: the game, its leaderboard, and the share, report and
 * remix actions. Anyone can read, share and report; remixing needs an
 * account (CON-006).
 */

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ApiError,
  type ArcadeGame,
  type ReportReason,
  type Score,
} from "@/models";
import { newIdempotencyKey } from "@/lib/idempotency";
import { arcadeRepo } from "@/models/repositories";
import { useSessionUser } from "./auth";
import { useToast } from "./toast";
import { useRequest } from "./use-request";

export type GameDialog = "share" | "report" | "remix";

export interface GameController {
  game: ArcadeGame | null;
  loading: boolean;
  /** The game does not exist or is no longer published. */
  notFound: boolean;
  /** The game could not be loaded for another reason. */
  failed: boolean;
  reload: () => Promise<void>;
  scores: Score[];
  scoresLoading: boolean;
  scoresFailed: boolean;
  /** Null until the session read settles. */
  signedIn: boolean | null;
  dialog: GameDialog | null;
  openDialog: (dialog: GameDialog) => void;
  closeDialog: () => void;
  /** The public address of this game. */
  shareUrl: string;
  copied: boolean;
  copyLink: () => Promise<void>;
  /** True while a report or a remix is in flight. */
  saving: boolean;
  actionError: string | null;
  reportSent: boolean;
  report: (reason: ReportReason, details: string) => Promise<void>;
  remix: () => Promise<void>;
}

export function useGameController(slug: string): GameController {
  const router = useRouter();
  const { addToast } = useToast();
  const session = useSessionUser();
  const gameRequest = useRequest(() => arcadeRepo.get(slug), [slug]);
  const scoresRequest = useRequest(() => arcadeRepo.scores(slug), [slug]);

  const [dialog, setDialog] = useState<GameDialog | null>(null);
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [reportSent, setReportSent] = useState(false);

  const shareUrl =
    typeof window === "undefined"
      ? `/arcade/${slug}`
      : `${window.location.origin}/arcade/${slug}`;

  const openDialog = useCallback((next: GameDialog) => {
    setActionError(null);
    setCopied(false);
    setReportSent(false);
    setDialog(next);
  }, []);

  const closeDialog = useCallback(() => {
    setDialog(null);
    setActionError(null);
  }, []);

  const copyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setActionError(null);
    } catch {
      setActionError("We could not copy the link. Select it and copy it.");
    }
  }, [shareUrl]);

  const report = useCallback(
    async (reason: ReportReason, details: string) => {
      setSaving(true);
      setActionError(null);
      try {
        await arcadeRepo.report(slug, reason, details);
        setReportSent(true);
      } catch (error) {
        setActionError(
          error instanceof ApiError && error.status < 500
            ? error.message
            : "We could not send the report. Try again.",
        );
      } finally {
        setSaving(false);
      }
    },
    [slug],
  );

  const remix = useCallback(async () => {
    setSaving(true);
    setActionError(null);
    try {
      await arcadeRepo.remix(slug, newIdempotencyKey());
      addToast("Remix created. It is in My Games.", "success");
      setDialog(null);
      router.push("/dashboard");
    } catch (error) {
      setActionError(
        error instanceof ApiError && error.status < 500
          ? error.message
          : "We could not create the remix. Try again.",
      );
    } finally {
      setSaving(false);
    }
  }, [addToast, router, slug]);

  const error = gameRequest.error;
  const notFound = error instanceof ApiError && error.status === 404;

  return {
    game: gameRequest.data,
    loading: gameRequest.loading,
    notFound,
    failed: error !== null && !notFound,
    reload: gameRequest.reload,
    scores: scoresRequest.data ?? [],
    scoresLoading: scoresRequest.loading,
    scoresFailed: scoresRequest.error !== null,
    signedIn: session.checked ? session.user !== null : null,
    dialog,
    openDialog,
    closeDialog,
    shareUrl,
    copied,
    copyLink,
    saving,
    actionError,
    reportSent,
    report,
    remix,
  };
}
