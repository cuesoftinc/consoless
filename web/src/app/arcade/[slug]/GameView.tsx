"use client";

/**
 * A game's page: the console frame, who made it and from what prompt, the
 * leaderboard, and share, remix and report.
 */

import Link from "next/link";
import { Flag, GitFork, SearchX, Share2 } from "lucide-react";
import {
  RemixDialog,
  ReportDialog,
  ShareDialog,
} from "@/components/arcade/GameDialogs";
import Badge from "@/components/ui/Badge";
import Banner from "@/components/ui/Banner";
import Button, { buttonClasses } from "@/components/ui/Button";
import ConsoleFrame from "@/components/ui/ConsoleFrame";
import EmptyState from "@/components/ui/EmptyState";
import GameScreen from "@/components/ui/GameScreen";
import LeaderboardRow from "@/components/ui/LeaderboardRow";
import Skeleton from "@/components/ui/Skeleton";
import { useGameController } from "@/controllers/use-game";
import { cn } from "@/lib/cn";
import { frameStyleOf, paletteOf, STYLE_LABEL } from "@/lib/console-styles";
import { relativeTime } from "@/lib/relative-time";

const LINK =
  "rounded-sm text-accent-text underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring";

export default function GameView({ slug }: { slug: string }) {
  const page = useGameController(slug);
  const { game } = page;

  if (page.notFound) {
    return (
      <EmptyState
        icon={SearchX}
        title="This game is not available"
        body="It may have been unpublished or removed, or the link may be wrong."
        action={
          <Link href="/arcade" className={buttonClasses("primary", "md")}>
            Browse the Arcade
          </Link>
        }
      />
    );
  }

  if (page.failed) {
    return (
      <Banner
        kind="danger"
        action={
          <Button kind="secondary" size="sm" onClick={() => void page.reload()}>
            Try again
          </Button>
        }
      >
        We could not load this game.
      </Banner>
    );
  }

  if (!game) {
    return (
      <div
        aria-busy="true"
        aria-label="Loading game"
        data-testid="game-loading"
        className="flex flex-col gap-4"
      >
        <Skeleton className="h-8 w-64 max-w-full" />
        <Skeleton className="h-4 w-40" />
        <Skeleton kind="block" className="h-80 w-full max-w-120" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
      <section className="flex flex-col gap-6">
        <header className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-heading-lg text-text-primary">{game.title}</h1>
            <Badge kind="neutral">{STYLE_LABEL[game.style_id]}</Badge>
          </div>
          <p className="text-body-md text-text-secondary">
            by {game.author.display_name} · published{" "}
            {relativeTime(game.published_at)}
          </p>
          {game.remixed_from ? (
            <p className="text-body-sm text-text-secondary">
              A remix of{" "}
              <Link href={`/arcade/${game.remixed_from.slug}`} className={LINK}>
                {game.remixed_from.title}
              </Link>{" "}
              by {game.remixed_from.author.display_name}.
            </p>
          ) : null}
        </header>

        <div
          data-testid="game-frame"
          className="flex min-h-100 items-center justify-center rounded-xl border border-border-default bg-bg-surface p-6"
        >
          {/* The cabinet is tall, so it gets a narrower column. */}
          <div
            className={cn(
              "flex w-full justify-center",
              game.style_id === "arcade" ? "max-w-80" : "max-w-120",
            )}
          >
            <ConsoleFrame consoleStyle={frameStyleOf(game.style_id)}>
              <GameScreen
                game={game.artwork}
                palette={paletteOf(game.style_id)}
                className="h-full w-full"
              />
            </ConsoleFrame>
          </div>
        </div>

        <Banner kind="info">
          This is a picture of the game. Playing in the browser arrives with the
          game engine.
        </Banner>

        <div className="flex flex-wrap gap-3">
          <Button
            kind="secondary"
            icon={Share2}
            onClick={() => page.openDialog("share")}
          >
            Share
          </Button>
          <Button
            kind="secondary"
            icon={GitFork}
            onClick={() => page.openDialog("remix")}
            disabled={page.signedIn === null}
          >
            Remix
          </Button>
          <Button
            kind="ghost"
            icon={Flag}
            onClick={() => page.openDialog("report")}
          >
            Report
          </Button>
        </div>

        <section aria-labelledby="game-prompt" className="flex flex-col gap-2">
          <h2 id="game-prompt" className="text-heading-sm text-text-primary">
            The prompt that made it
          </h2>
          <blockquote className="rounded-lg border border-border-default bg-bg-raised p-4 text-body-md text-text-primary">
            {game.prompt}
          </blockquote>
        </section>
      </section>

      <section aria-labelledby="game-scores" className="flex flex-col gap-3">
        <h2 id="game-scores" className="text-heading-sm text-text-primary">
          Leaderboard
        </h2>
        {page.scoresFailed ? (
          <Banner kind="danger">We could not load the scores.</Banner>
        ) : page.scoresLoading && page.scores.length === 0 ? (
          <div aria-busy="true" aria-label="Loading scores">
            <Skeleton className="mb-3 h-10 w-full" />
            <Skeleton className="mb-3 h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : page.scores.length === 0 ? (
          <p
            data-testid="no-scores"
            className="rounded-lg border border-border-default bg-bg-raised p-6 text-body-md text-text-secondary"
          >
            No scores yet.
          </p>
        ) : (
          <ol className="overflow-hidden rounded-lg border border-border-default bg-bg-raised">
            {page.scores.map((score) => (
              <LeaderboardRow
                key={score.player.username}
                rank={score.rank}
                name={score.player.display_name}
                score={score.value}
                you={score.you}
              />
            ))}
          </ol>
        )}
        <p className="text-caption text-text-muted">
          Each player&apos;s best score. Signed-in players can submit scores.
        </p>
      </section>

      {page.dialog === "share" ? (
        <ShareDialog
          game={game}
          url={page.shareUrl}
          copied={page.copied}
          error={page.actionError}
          onCopy={() => void page.copyLink()}
          onClose={page.closeDialog}
        />
      ) : null}
      {page.dialog === "report" ? (
        <ReportDialog
          game={game}
          saving={page.saving}
          sent={page.reportSent}
          error={page.actionError}
          onReport={(reason, details) => void page.report(reason, details)}
          onClose={page.closeDialog}
        />
      ) : null}
      {page.dialog === "remix" ? (
        <RemixDialog
          game={game}
          signedIn={page.signedIn === true}
          saving={page.saving}
          error={page.actionError}
          onRemix={() => void page.remix()}
          onClose={page.closeDialog}
        />
      ) : null}
    </div>
  );
}
