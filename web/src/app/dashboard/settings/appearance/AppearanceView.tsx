"use client";

/** Settings / Appearance: Light (the default), Dark, or follow the device. */

import RadioGroup, { RadioItem } from "@/components/ui/RadioGroup";
import { useTheme, type ThemePreference } from "@/design/ThemeProvider";

export default function AppearanceView() {
  const { preference, setPreference } = useTheme();
  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-heading-sm text-text-primary">Theme</h2>
        <p className="text-body-sm text-text-secondary">
          The choice is saved in this browser.
        </p>
      </div>
      <RadioGroup
        aria-label="Theme"
        value={preference}
        onValueChange={(value) => setPreference(value as ThemePreference)}
      >
        <RadioItem value="light" label="Light" />
        <RadioItem value="dark" label="Dark" />
        <RadioItem value="system" label="Match my device" />
      </RadioGroup>
    </section>
  );
}
