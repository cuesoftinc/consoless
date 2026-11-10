import { Gamepad2, History, Share2, WandSparkles } from "lucide-react";
import { ANCHORS } from "./links";
import Section, { Card } from "./Section";

const STEPS = [
  {
    icon: WandSparkles,
    title: "Describe it",
    body: "Say what you want in plain language: the kind of game, how it plays and the look.",
  },
  {
    icon: Gamepad2,
    title: "Play it",
    body: "We write the game against the open-source engine, check that it runs and load it in your browser.",
  },
  {
    icon: History,
    title: "Keep changing it",
    body: "Every message edits the same game and saves a version you can go back to.",
  },
  {
    icon: Share2,
    title: "Share it",
    body: "Publish to a public link. Anyone can play it, and signed-in players can remix it.",
  },
];

export default function FeaturesSection() {
  return (
    <Section id={ANCHORS.features} title="How it works">
      <ol className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map(({ icon: Icon, title, body }) => (
          <li key={title}>
            <Card className="h-full">
              <Icon aria-hidden className="h-6 w-6 text-accent-text" />
              <h3 className="text-heading-md text-text-primary">{title}</h3>
              <p className="text-body-md text-text-secondary">{body}</p>
            </Card>
          </li>
        ))}
      </ol>
    </Section>
  );
}
