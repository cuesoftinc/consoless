/**
 * ConsoleFrame: the six console styles as CSS-drawn frames around a
 * screen slot. These are original designs and copy no real console. The
 * frame is fluid up to a max width, the screen slot keeps a fixed aspect
 * ratio, and every drawn control is decorative (aria-hidden).
 */

import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type ConsoleFrameStyle =
  "handheld" | "8-bit" | "16-bit" | "arcade" | "modern" | "3d";

export interface ConsoleFrameProps {
  /** The console style (named to avoid the DOM `style` attribute). */
  consoleStyle: ConsoleFrameStyle;
  /** The screen content, for example a GameScreen. It fills the slot. */
  children?: ReactNode;
  className?: string;
}

function Screen({
  aspect,
  className,
  children,
}: {
  aspect: string;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div
      data-testid="console-screen"
      className={cn(
        "relative w-full overflow-hidden bg-console-screen-black",
        aspect,
        className,
      )}
    >
      <div className="absolute inset-0">{children}</div>
    </div>
  );
}

function Handheld({ children }: { children?: ReactNode }) {
  return (
    <div
      data-testid="console-shell"
      className="flex flex-col gap-6 rounded-xl bg-console-shell-cream p-6"
    >
      <div className="rounded-lg bg-console-shell-charcoal px-6 pt-6 pb-8">
        <Screen aspect="aspect-[10/9]">{children}</Screen>
      </div>
      <div aria-hidden className="flex items-center justify-between px-2">
        <div className="relative h-24 w-24">
          <div className="absolute top-0 left-8 h-24 w-8 rounded-sm bg-console-shell-charcoal" />
          <div className="absolute top-8 left-0 h-8 w-24 rounded-sm bg-console-shell-charcoal" />
        </div>
        <div className="relative h-22 w-30">
          <div className="absolute bottom-0 left-0 h-12 w-12 rounded-full bg-console-shell-plum" />
          <div className="absolute top-0 right-0 h-12 w-12 rounded-full bg-console-shell-plum" />
        </div>
      </div>
      <div aria-hidden className="flex justify-center gap-4">
        <div className="h-3 w-12 rounded-full bg-console-shell-grey" />
        <div className="h-3 w-12 rounded-full bg-console-shell-grey" />
      </div>
      <div aria-hidden className="flex justify-end gap-2">
        <div className="h-10 w-1.5 rounded-full bg-console-shell-grey" />
        <div className="h-10 w-1.5 rounded-full bg-console-shell-grey" />
        <div className="h-10 w-1.5 rounded-full bg-console-shell-grey" />
        <div className="h-10 w-1.5 rounded-full bg-console-shell-grey" />
      </div>
    </div>
  );
}

function EightBit({ children }: { children?: ReactNode }) {
  return (
    <div
      data-testid="console-shell"
      className="flex flex-col gap-6 rounded-md bg-console-shell-grey p-8"
    >
      <div className="rounded-md bg-console-shell-charcoal p-6">
        <Screen aspect="aspect-[16/15]">{children}</Screen>
      </div>
      <div className="flex items-center justify-between">
        <div aria-hidden className="flex gap-3">
          <div className="h-6 w-18 rounded-sm bg-console-shell-charcoal" />
          <div className="h-6 w-18 rounded-sm bg-console-shell-charcoal" />
        </div>
        <div aria-hidden className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-console-px-pink" />
          <span className="font-retro text-retro-sm text-console-shell-charcoal">
            POWER
          </span>
        </div>
      </div>
    </div>
  );
}

function SixteenBit({ children }: { children?: ReactNode }) {
  return (
    <div
      data-testid="console-shell"
      className="flex flex-col gap-6 rounded-xl bg-console-shell-cream p-8"
    >
      <div className="rounded-xl bg-console-shell-plum p-6">
        <Screen aspect="aspect-[8/7]">{children}</Screen>
      </div>
      <div aria-hidden className="flex items-center justify-between">
        <div className="flex gap-3">
          <div className="h-4 w-14 rounded-full bg-console-shell-grey" />
          <div className="h-4 w-14 rounded-full bg-console-shell-grey" />
        </div>
        <div className="flex gap-3">
          <div className="h-6 w-6 rounded-full bg-console-px-pink" />
          <div className="h-6 w-6 rounded-full bg-console-px-yellow" />
          <div className="h-6 w-6 rounded-full bg-console-px-green" />
          <div className="h-6 w-6 rounded-full bg-console-px-cyan" />
        </div>
      </div>
    </div>
  );
}

function Arcade({ children }: { children?: ReactNode }) {
  return (
    <div
      data-testid="console-shell"
      className="overflow-hidden rounded-md bg-console-shell-wood"
    >
      <div
        aria-hidden
        className="flex h-22 items-center justify-center bg-console-px-orange"
      >
        <span className="font-retro text-retro-lg text-console-screen-black">
          ARCADE
        </span>
      </div>
      <div className="flex flex-col items-center gap-6 p-8">
        <div className="w-full rounded-md bg-console-shell-charcoal p-6">
          <Screen aspect="aspect-[3/4]">{children}</Screen>
        </div>
        <div
          aria-hidden
          className="flex w-full items-center justify-between rounded-md bg-console-shell-charcoal p-6"
        >
          <div className="relative h-18 w-16">
            <div className="absolute bottom-0 left-0 h-3 w-16 rounded-full bg-console-shell-grey" />
            <div className="absolute bottom-2 left-1/2 h-10 w-3 -translate-x-1/2 bg-console-shell-grey" />
            <div className="absolute top-0 left-1/2 h-9 w-9 -translate-x-1/2 rounded-full bg-console-px-pink" />
          </div>
          <div className="flex gap-4">
            <div className="h-9 w-9 rounded-full bg-console-px-cyan" />
            <div className="h-9 w-9 rounded-full bg-console-px-yellow" />
            <div className="h-9 w-9 rounded-full bg-console-px-green" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Flat({ glow, children }: { glow: boolean; children?: ReactNode }) {
  return (
    <div
      data-testid="console-shell"
      className={cn(
        "rounded-xl bg-bg-inset p-2",
        glow
          ? "border-2 border-accent-default shadow-glow"
          : "border border-border-strong shadow-lg",
      )}
    >
      <Screen aspect="aspect-video" className="rounded-lg">
        {children}
      </Screen>
    </div>
  );
}

const MAX_WIDTH: Record<ConsoleFrameStyle, string> = {
  handheld: "max-w-[360px]",
  "8-bit": "max-w-[640px]",
  "16-bit": "max-w-[640px]",
  arcade: "max-w-[480px]",
  modern: "max-w-[720px]",
  "3d": "max-w-[720px]",
};

export default function ConsoleFrame({
  consoleStyle,
  children,
  className,
}: ConsoleFrameProps) {
  return (
    <div
      data-style={consoleStyle}
      data-testid="console-frame"
      className={cn("w-full", MAX_WIDTH[consoleStyle], className)}
    >
      {consoleStyle === "handheld" ? (
        <Handheld>{children}</Handheld>
      ) : consoleStyle === "8-bit" ? (
        <EightBit>{children}</EightBit>
      ) : consoleStyle === "16-bit" ? (
        <SixteenBit>{children}</SixteenBit>
      ) : consoleStyle === "arcade" ? (
        <Arcade>{children}</Arcade>
      ) : (
        <Flat glow={consoleStyle === "3d"}>{children}</Flat>
      )}
    </div>
  );
}
