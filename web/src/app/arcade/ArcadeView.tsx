"use client";

/** The Arcade: every published game, most played first. */

import { Gamepad2, SearchX } from "lucide-react";
import Banner from "@/components/ui/Banner";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import GameCard from "@/components/ui/GameCard";
import GameCardSkeleton from "@/components/ui/GameCardSkeleton";
import GameScreen from "@/components/ui/GameScreen";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { useArcadeController } from "@/controllers/use-arcade";
import { paletteOf, STYLE_IDS, STYLE_LABEL } from "@/lib/console-styles";
import type { ConsoleStyleId } from "@/models";

const GRID =
  "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";
const ALL = "all";
const STYLE_OPTIONS = [
  { value: ALL, label: "All styles" },
  ...STYLE_IDS.map((id) => ({ value: id, label: STYLE_LABEL[id] })),
];

const plays = (count: number) =>
  `${new Intl.NumberFormat("en").format(count)} ${count === 1 ? "play" : "plays"}`;

export default function ArcadeView({ fail = false }: { fail?: boolean }) {
  const arcade = useArcadeController({ fail });

  let body: React.ReactNode;
  if (arcade.failed) {
    body = (
      <Banner
        kind="danger"
        action={
          <Button
            kind="secondary"
            size="sm"
            onClick={() => void arcade.reload()}
          >
            Try again
          </Button>
        }
      >
        We could not load the Arcade.
      </Banner>
    );
  } else if (arcade.loading && arcade.games.length === 0) {
    body = (
      <div
        aria-busy="true"
        aria-label="Loading games"
        data-testid="arcade-loading"
        className={GRID}
      >
        {[0, 1, 2, 3, 4, 5, 6, 7].map((index) => (
          <GameCardSkeleton key={index} className="max-w-none" />
        ))}
      </div>
    );
  } else if (arcade.games.length === 0 && arcade.filtered) {
    body = (
      <EmptyState
        icon={SearchX}
        title="No games match"
        body="Try another search, or show every style."
        action={
          <Button kind="secondary" onClick={arcade.clearFilters}>
            Clear search
          </Button>
        }
      />
    );
  } else if (arcade.games.length === 0) {
    body = (
      <EmptyState
        icon={Gamepad2}
        title="No games yet"
        body="Published games appear here."
      />
    );
  } else {
    body = (
      <ul className={GRID}>
        {arcade.games.map((game) => (
          <li key={game.slug}>
            <GameCard
              title={game.title}
              byline={`by ${game.author.display_name}`}
              meta={plays(game.plays)}
              badge={STYLE_LABEL[game.style_id]}
              href={`/arcade/${game.slug}`}
              screen={
                <GameScreen
                  game={game.artwork}
                  palette={paletteOf(game.style_id)}
                  className="h-full w-full"
                />
              }
              className="max-w-none"
            />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-heading-lg text-text-primary">Arcade</h1>
        <p className="text-body-md text-text-secondary">
          Games people made on Consoless. Anyone can play, with no account.
        </p>
      </header>

      <div
        role="search"
        aria-label="Games"
        className="flex flex-col gap-4 sm:flex-row sm:items-end"
      >
        <Input
          label="Search"
          type="search"
          placeholder="Title, author or prompt"
          value={arcade.query}
          onChange={(event) => arcade.setQuery(event.target.value)}
          className="sm:w-80"
        />
        <Select
          label="Console style"
          value={arcade.style ?? ALL}
          onValueChange={(value) =>
            arcade.setStyle(value === ALL ? null : (value as ConsoleStyleId))
          }
          options={STYLE_OPTIONS}
          className="sm:w-48"
        />
      </div>

      <p role="status" className="sr-only">
        {arcade.loading
          ? ""
          : `${arcade.games.length} ${arcade.games.length === 1 ? "game" : "games"}`}
      </p>

      {body}
    </div>
  );
}
