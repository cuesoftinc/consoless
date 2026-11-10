import Link from "next/link";
import { Cloud, Server } from "lucide-react";
import { buttonClasses } from "@/components/ui/Button";
import { ANCHORS, DOCS_URL, SIGNIN_PATH } from "./links";
import Section, { Card, externalLinkProps } from "./Section";

export interface SelfHostSectionProps {
  onTryCloud?: () => void;
  onSelfHost?: () => void;
}

/** Hosted or self-hosted: the two ways to run Consoless. */
export default function SelfHostSection({
  onTryCloud,
  onSelfHost,
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
            you bring your own model key. Self-hosting is free forever. The
            self-host guide arrives with the engine and the services.
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
    </Section>
  );
}
