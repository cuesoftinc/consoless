import type { MetadataRoute } from "next";

const SITE = "https://consoless.cuesoft.io";

/** Public routes only: never the dashboard or the sign-in screen. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE}/arcade`, changeFrequency: "daily", priority: 0.8 },
  ];
}
