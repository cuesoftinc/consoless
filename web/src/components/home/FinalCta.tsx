import Link from "next/link";
import { buttonClasses } from "@/components/ui/Button";
import { PatternStrip } from "@/components/ui/PatternTile";
import { GITHUB_URL, SIGNIN_PATH } from "./links";
import { CONTAINER, externalLinkProps } from "./Section";

export interface FinalCtaProps {
  onStart?: () => void;
  onGithub?: () => void;
}

export default function FinalCta({ onStart, onGithub }: FinalCtaProps) {
  return (
    <section aria-labelledby="final-cta-heading" className="pb-16">
      <PatternStrip count={16} />
      <div
        className={`${CONTAINER} flex flex-col items-center gap-6 pt-12 text-center`}
      >
        <h2
          id="final-cta-heading"
          className="text-display-lg text-text-primary"
        >
          Make your first game
        </h2>
        <p className="max-w-140 text-body-lg text-text-secondary">
          Describe it in a sentence. Play it in minutes.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href={SIGNIN_PATH}
            onClick={onStart}
            className={buttonClasses("primary", "md")}
          >
            Start building
          </Link>
          <a
            href={GITHUB_URL}
            onClick={onGithub}
            className={buttonClasses("secondary", "md")}
            {...externalLinkProps}
          >
            View on GitHub
          </a>
        </div>
      </div>
    </section>
  );
}
