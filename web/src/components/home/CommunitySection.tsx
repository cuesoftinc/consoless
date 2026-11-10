import { Users } from "lucide-react";
import { buttonClasses } from "@/components/ui/Button";
import { ANCHORS, CUELABS_URL, DISCORD_URL, ROADMAP_URL } from "./links";
import Section, { Card, externalLinkProps } from "./Section";

const LINK =
  "rounded-sm text-label-md text-accent-text hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring";

export interface CommunitySectionProps {
  onDiscord?: () => void;
}

/** Community: the Discord channel, the public roadmap and CueLABS. */
export default function CommunitySection({ onDiscord }: CommunitySectionProps) {
  return (
    <Section id={ANCHORS.community} title="Community">
      <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-[minmax(0,480px)_1fr]">
        <Card className="items-start gap-4 p-8">
          <Users aria-hidden className="h-6 w-6 text-accent-text" />
          <h3 className="text-heading-md text-text-primary">
            Build with us on Discord
          </h3>
          <p className="text-body-md text-text-secondary">
            Proposals, previews and support happen in the open, in
            #consoless-lab on the CueLABS™ Discord.
          </p>
          <a
            href={DISCORD_URL}
            onClick={onDiscord}
            className={buttonClasses("secondary", "md")}
            {...externalLinkProps}
          >
            Join the Discord
          </a>
        </Card>
        <ul className="flex flex-col gap-4">
          <li>
            <a href={ROADMAP_URL} className={LINK} {...externalLinkProps}>
              See the public roadmap
            </a>
          </li>
          <li>
            <a href={CUELABS_URL} className={LINK} {...externalLinkProps}>
              More open-source products from CueLABS™
            </a>
          </li>
        </ul>
      </div>
    </Section>
  );
}
