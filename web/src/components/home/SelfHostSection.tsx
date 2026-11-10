import Link from "next/link";
import { Cloud, Server } from "lucide-react";
import { buttonClasses } from "@/components/ui/Button";
import CodeSnippet from "@/components/ui/CodeSnippet";
import { ANCHORS, DOCS_URL, GITHUB_URL, SIGNIN_PATH } from "./links";
import Section, { Card, externalLinkProps } from "./Section";

/** The commands that run Consoless yourself. Both work from a fresh clone. */
export const SELF_HOST_TABS = [
  {
    id: "compose",
    label: "Docker Compose",
    code: "git clone https://github.com/cuesoftinc/consoless\ncd consoless && docker compose up --build -d",
  },
  {
    id: "npm",
    label: "npm",
    code: "git clone https://github.com/cuesoftinc/consoless\ncd consoless/web && npm ci && NEXT_PUBLIC_TEST_MODE=true npm run dev",
  },
];

export interface SelfHostSectionProps {
  onTryCloud?: () => void;
  onSelfHost?: () => void;
  /** Called with the install method whose commands were copied. */
  onCopyCommand?: (method: string) => void;
}

/** Hosted or self-hosted: the two ways to run Consoless. */
export default function SelfHostSection({
  onTryCloud,
  onSelfHost,
  onCopyCommand,
}: SelfHostSectionProps) {
  return (
    <Section
      id={ANCHORS.selfHost}
      title="Hosted, or run it yourself"
      intro="The engine, the runtime and the game format are open-source. Use our hosted service, or run the whole platform on your own infrastructure."
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card className="items-start gap-4 p-8">
          <Cloud aria-hidden className="h-6 w-6 text-accent-text" />
          <h3 className="text-heading-md text-text-primary">
            Hosted by CueLABS™
          </h3>
          <p className="text-body-md text-text-secondary">
            We run the AI generation, the checks, storage and publishing, so you
            can start without setting anything up. The hosted service is free,
            with 20 generations a day.
          </p>
          <Link
            href={SIGNIN_PATH}
            onClick={onTryCloud}
            className={buttonClasses("primary", "md")}
          >
            Try Cloud
          </Link>
        </Card>
        <Card className="items-start gap-4 p-8">
          <Server aria-hidden className="h-6 w-6 text-accent-text" />
          <h3 className="text-heading-md text-text-primary">Self-hosted</h3>
          <p className="text-body-md text-text-secondary">
            Your prompts, code and games stay on your own infrastructure, and
            you bring your own model key. Self-hosting is free forever.
          </p>
          <a
            href={DOCS_URL}
            onClick={onSelfHost}
            className={buttonClasses("secondary", "md")}
            {...externalLinkProps}
          >
            Read the docs
          </a>
        </Card>
      </div>

      <div
        data-testid="selfhost-snippet"
        className="mx-auto mt-12 flex w-full max-w-180 flex-col gap-3"
      >
        <h3 className="text-heading-md text-text-primary">
          Run it yourself in two commands
        </h3>
        <CodeSnippet
          tabs={SELF_HOST_TABS}
          tabsLabel="Install method"
          label="Self-host commands"
          onCopy={onCopyCommand}
        />
        <p className="text-body-sm text-text-secondary">
          Open http://localhost:3000. Today this starts the web app on its
          built-in mock API. The engine and the services join the same command
          as they are built.{" "}
          <a
            href={GITHUB_URL}
            className="rounded-sm text-accent-text underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
            {...externalLinkProps}
          >
            github.com/cuesoftinc/consoless
          </a>
        </p>
      </div>
    </Section>
  );
}
