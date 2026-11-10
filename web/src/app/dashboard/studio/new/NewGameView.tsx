"use client";

/** New game: describe it, pick a console style, and the Studio opens. */

import StylePicker from "@/components/studio/StylePicker";
import { styleOption } from "@/components/studio/style-options";
import Banner from "@/components/ui/Banner";
import PromptInput from "@/components/ui/PromptInput";
import { useNewGameController } from "@/controllers/use-new-game";

export const STARTERS = [
  "A falling-block puzzle on a handheld with a green screen",
  "A platformer where you collect coins",
  "A top-down space shooter",
  "A maze you solve against the clock",
];

const CHIP =
  "cursor-pointer rounded-full border border-border-default bg-bg-raised px-3 py-1 text-caption text-text-secondary hover:border-border-strong hover:text-text-primary transition-colors duration-fast ease-enter motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring";

export default function NewGameView() {
  const game = useNewGameController();
  const option = styleOption(game.style);

  return (
    <div className="mx-auto flex w-full max-w-180 flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-heading-lg text-text-primary">New game</h1>
        <p className="text-body-md text-text-secondary">
          Describe the game you want. You can keep changing it by chatting once
          the first version is ready.
        </p>
      </header>

      {game.quotaOut ? (
        <Banner kind="warning">
          You have used today&apos;s generations. They reset tomorrow.
        </Banner>
      ) : null}
      {game.error ? <Banner kind="danger">{game.error}</Banner> : null}

      <PromptInput
        value={game.prompt}
        onChange={game.setPrompt}
        onSubmit={() => void game.create()}
        styleLabel={option.name}
        styleIcon={option.icon}
        disabled={game.creating || game.quotaOut}
        placeholder="Describe your game"
      />

      <ul aria-label="Starter prompts" className="flex flex-wrap gap-2">
        {STARTERS.map((starter) => (
          <li key={starter}>
            <button
              type="button"
              className={CHIP}
              onClick={() => game.setPrompt(starter)}
              disabled={game.creating}
            >
              {starter}
            </button>
          </li>
        ))}
      </ul>

      <section className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <h2 className="text-heading-sm text-text-primary">Console style</h2>
          <p className="text-body-sm text-text-secondary">
            The style sets the frame, the colours and the controls. You can
            switch it at any time.
          </p>
        </div>
        <StylePicker value={game.style} onChange={game.setStyle} />
      </section>
    </div>
  );
}
