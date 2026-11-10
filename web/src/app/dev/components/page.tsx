import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ComponentGallery from "./gallery";

/**
 * Dev-only component gallery: every components/ui set in its variants, for
 * checking the build against the Figma file. Available in dev and
 * TEST_MODE builds; a 404 in production.
 */
export const metadata: Metadata = {
  title: "Component gallery (dev)",
  robots: { index: false },
};

export default function DevComponentsPage() {
  if (
    process.env.NODE_ENV === "production" &&
    process.env.NEXT_PUBLIC_TEST_MODE !== "true"
  ) {
    notFound();
  }
  return <ComponentGallery />;
}
