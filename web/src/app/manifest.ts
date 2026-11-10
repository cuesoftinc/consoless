import type { MetadataRoute } from "next";

/**
 * Web app manifest, served at /manifest.webmanifest. The identity mirrors
 * the root layout metadata. The colours are design tokens (docs/design.md):
 * the Light page background, which is the default theme (P-04), and the
 * Light accent. The icons are placeholders until the brand owner supplies
 * the official mark (D-4); scripts/generate-brand-assets.mjs draws them.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Consoless",
    short_name: "Consoless",
    description: "Describe it. Play it. Share it.",
    start_url: "/",
    display: "standalone",
    background_color: "#f5f6fa",
    theme_color: "#0a6e78",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "16x16 32x32 48x48 256x256",
        type: "image/x-icon",
      },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
