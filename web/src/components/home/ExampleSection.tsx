import ChatMessage from "@/components/ui/ChatMessage";
import ConsoleFrame from "@/components/ui/ConsoleFrame";
import GameScreen from "@/components/ui/GameScreen";
import GenerationStatus from "@/components/ui/GenerationStatus";
import { ANCHORS } from "./links";
import Section from "./Section";

export default function ExampleSection() {
  return (
    <Section
      id={ANCHORS.example}
      title="From a sentence to a game"
      intro="The Studio puts the chat beside a live preview. Each version is type-checked and played for a few seconds before you see it."
    >
      <div className="grid grid-cols-1 items-center gap-8 rounded-xl border border-border-default bg-bg-surface p-4 md:p-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
        <div className="flex min-w-0 flex-col gap-4">
          <ChatMessage author="user">
            A side-scrolling platformer where you collect coins and jump over
            gaps.
          </ChatMessage>
          <ChatMessage author="assistant">
            I built a platformer with three platforms, eight coins and one
            enemy. Arrow keys move and Space jumps.
          </ChatMessage>
          <GenerationStatus state="ready" version={1} />
        </div>
        <ConsoleFrame consoleStyle="modern">
          <GameScreen game="platformer" />
        </ConsoleFrame>
      </div>
    </Section>
  );
}
