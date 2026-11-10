"use client";

/**
 * The landing page composition root: marketing nav, one <main> with the
 * bands of docs/pages.md Part A, and the marketing footer. Handlers come
 * from the home controller; the bands are render-only.
 */

import MarketingFooter from "@/components/ui/MarketingFooter";
import MarketingNav from "@/components/ui/MarketingNav";
import { PatternStrip } from "@/components/ui/PatternTile";
import { useHomeController } from "@/controllers/home";
import ArcadeSection from "./ArcadeSection";
import ConsolesSection from "./ConsolesSection";
import DevelopersSection from "./DevelopersSection";
import ExampleSection from "./ExampleSection";
import FaqSection from "./FaqSection";
import FeaturesSection from "./FeaturesSection";
import FinalCta from "./FinalCta";
import HeroSection from "./HeroSection";
import CommunitySection from "./CommunitySection";
import SelfHostSection from "./SelfHostSection";

export default function HomeView() {
  const home = useHomeController();

  return (
    <div className="flex min-h-screen flex-col bg-bg-base text-text-primary">
      <MarketingNav starCount={home.stars} onLinkClick={home.onNavLink} />
      <main id="main" tabIndex={-1} className="flex-1">
        <HeroSection onStart={home.onTryCloud} onGithub={home.onGithub} />
        <PatternStrip count={16} />
        <FeaturesSection />
        <ExampleSection />
        <ConsolesSection onInteract={home.onDemo} />
        <ArcadeSection />
        <DevelopersSection
          onContribute={home.onContribute}
          onGithub={home.onGithub}
        />
        <SelfHostSection
          onTryCloud={home.onTryCloud}
          onSelfHost={home.onSelfHost}
          onCopyCommand={home.onCopyCommand}
        />
        <CommunitySection onDiscord={home.onContribute} />
        <FaqSection onOpen={home.onFaqOpen} />
        <FinalCta onStart={home.onTryCloud} onGithub={home.onGithub} />
      </main>
      <MarketingFooter />
    </div>
  );
}
