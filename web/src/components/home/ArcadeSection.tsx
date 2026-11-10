import Badge from "@/components/ui/Badge";
import GameScreen, {
  type GameScreenGame,
  type GameScreenPalette,
} from "@/components/ui/GameScreen";
import { ANCHORS } from "./links";
import Section from "./Section";

interface Example {
  game: GameScreenGame;
  palette: GameScreenPalette;
  title: string;
  prompt: string;
  style: string;
}

const EXAMPLES: Example[] = [
  {
    game: "blocks",
    palette: "green",
    title: "Falling-block puzzle",
    prompt: "A falling-block puzzle on a handheld with a green screen",
    style: "Handheld",
  },
  {
    game: "platformer",
    palette: "colour",
    title: "Platformer",
    prompt: "A platformer where you collect coins and jump over gaps",
    style: "8-bit",
  },
  {
    game: "shooter",
    palette: "colour",
    title: "Space shooter",
    prompt: "A top-down space shooter with waves of enemies",
    style: "Arcade",
  },
  {
    game: "platformer",
    palette: "green",
    title: "Coin run",
    prompt: "A coin-collecting run across three platforms",
    style: "Handheld",
  },
];

/** What a prompt can become. The pictures are illustrations, not games. */
export default function ArcadeSection() {
  return (
    <Section
      id={ANCHORS.arcade}
      title="What you can make"
      intro="Stage one covers retro and 2D games: puzzles, platformers, shooters and top-down adventures. Finished games are published to the Arcade, where anyone can play them."
    >
      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {EXAMPLES.map((example) => (
          <li key={example.title}>
            <article className="flex h-full flex-col overflow-hidden rounded-lg border border-border-default bg-bg-raised">
              <div className="aspect-[296/176] w-full overflow-hidden bg-bg-inset">
                <GameScreen game={example.game} palette={example.palette} />
              </div>
              <div className="flex flex-1 flex-col gap-2 p-4">
                <h3 className="text-heading-sm text-text-primary">
                  {example.title}
                </h3>
                <p className="flex-1 text-body-sm text-text-secondary">
                  “{example.prompt}”
                </p>
                <div>
                  <Badge>{example.style}</Badge>
                </div>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </Section>
  );
}
