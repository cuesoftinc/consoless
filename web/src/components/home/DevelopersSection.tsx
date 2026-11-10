import { Boxes, Code, ShieldCheck } from "lucide-react";
import { buttonClasses } from "@/components/ui/Button";
import {
  ANCHORS,
  CONTRIBUTING_URL,
  DISCORD_URL,
  GITHUB_URL,
  GOOD_FIRST_ISSUES_URL,
} from "./links";
import Section, { Card, externalLinkProps } from "./Section";

const TOPICS = [
  {
    icon: Code,
    title: "A TypeScript engine",
    body: "One runtime and one game format for 2D and 3D, with rendering kept behind the engine API. Every generated game is written against it, so people can read and change the code.",
  },
  {
    icon: ShieldCheck,
    title: "Checked before it is shown",
    body: "Each version is type-checked and played headlessly before anyone sees it. Games run in a sandbox on a separate address and cannot read your session.",
  },
  {
    icon: Boxes,
    title: "Console styles as data",
    body: "A style is a config file: frame, resolution, palette, controls and sound. Adding one needs no engine change.",
  },
];

export interface DevelopersSectionProps {
  onContribute?: () => void;
  onGithub?: () => void;
}

/** The band for contributors: the stack, the problems and where to start. */
export default function DevelopersSection({
  onContribute,
  onGithub,
}: DevelopersSectionProps) {
  return (
    <Section
      id={ANCHORS.developers}
      title="Built in the open"
      intro="Consoless is MIT-licensed. The web app is Next.js and TypeScript; the services are Go and Python. Join us in #consoless-lab on the CueLABS™ Discord."
    >
      <ul className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {TOPICS.map(({ icon: Icon, title, body }) => (
          <li key={title}>
            <Card className="h-full">
              <Icon aria-hidden className="h-6 w-6 text-accent-text" />
              <h3 className="text-heading-md text-text-primary">{title}</h3>
              <p className="text-body-md text-text-secondary">{body}</p>
            </Card>
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap gap-3">
        <a
          href={GITHUB_URL}
          onClick={onGithub}
          className={buttonClasses("primary", "md")}
          {...externalLinkProps}
        >
          View on GitHub
        </a>
        <a
          href={DISCORD_URL}
          className={buttonClasses("secondary", "md")}
          {...externalLinkProps}
        >
          Join the Discord
        </a>
        <a
          href={GOOD_FIRST_ISSUES_URL}
          onClick={onContribute}
          className={buttonClasses("ghost", "md")}
          {...externalLinkProps}
        >
          Good first issues
        </a>
        <a
          href={CONTRIBUTING_URL}
          onClick={onContribute}
          className={buttonClasses("ghost", "md")}
          {...externalLinkProps}
        >
          Contributing guide
        </a>
      </div>
    </Section>
  );
}
