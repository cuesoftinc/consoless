import Link from "next/link";
import { Smartphone } from "lucide-react";
import Badge from "@/components/ui/Badge";
import { buttonClasses } from "@/components/ui/Button";
import ConsoleFrame from "@/components/ui/ConsoleFrame";
import GameScreen from "@/components/ui/GameScreen";
import PromptInput from "@/components/ui/PromptInput";
import { ANCHORS, GITHUB_URL, SIGNIN_PATH } from "./links";
import { CONTAINER, externalLinkProps } from "./Section";

const STARTER_PROMPTS = [
  "A platformer where you collect coins",
  "A top-down space shooter",
  "A maze you solve against the clock",
];

const noop = () => undefined;

export interface HeroSectionProps {
  onStart?: () => void;
  onGithub?: () => void;
}

export default function HeroSection({ onStart, onGithub }: HeroSectionProps) {
  return (
    <section aria-labelledby="hero-heading" className="py-12 md:py-16">
      <div
        className={`${CONTAINER} grid grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,1fr)_360px]`}
      >
        <div className="flex min-w-0 flex-col items-start gap-6">
          <Badge kind="retro">Open-source, MIT licence</Badge>
          <h1
            id="hero-heading"
            className="text-display-lg text-text-primary md:text-display-xl"
          >
            Describe it. Play it. Share it.
          </h1>
          <p className="max-w-160 text-body-lg text-text-secondary">
            Type the game you want, pick a console style and play it in your
            browser in minutes. Keep changing it by chatting.
          </p>
          {/* A picture of the Studio composer, not a working control. */}
          <div inert className="w-full max-w-140">
            <PromptInput
              value="A falling-block puzzle on a handheld with a green screen"
              onChange={noop}
              onSubmit={noop}
              styleLabel="Handheld"
              styleIcon={Smartphone}
            />
          </div>
          <ul className="flex flex-wrap gap-2" aria-label="More ideas">
            {STARTER_PROMPTS.map((prompt) => (
              <li key={prompt}>
                <Badge>{prompt}</Badge>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-3">
            <Link
              href={SIGNIN_PATH}
              onClick={onStart}
              className={buttonClasses("primary", "md")}
            >
              Start building
            </Link>
            <a
              href={`#${ANCHORS.arcade}`}
              className={buttonClasses("secondary", "md")}
            >
              See what you can make
            </a>
            <a
              href={GITHUB_URL}
              onClick={onGithub}
              className={buttonClasses("ghost", "md")}
              {...externalLinkProps}
            >
              View on GitHub
            </a>
          </div>
        </div>
        <div className="mx-auto w-full max-w-90">
          <ConsoleFrame consoleStyle="handheld">
            <GameScreen game="blocks" palette="green" />
          </ConsoleFrame>
        </div>
      </div>
    </section>
  );
}
