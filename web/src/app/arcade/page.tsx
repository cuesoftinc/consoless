import type { Metadata } from "next";
import { env } from "@/config/env";
import ArcadeView from "./ArcadeView";

export const metadata: Metadata = {
  title: "Arcade",
  description:
    "Play games people made on Consoless. No account is needed to play.",
};

export default async function ArcadePage({
  searchParams,
}: {
  searchParams: Promise<{ fail?: string }>;
}) {
  const { fail } = await searchParams;
  // `?fail=1` drives the error state, in TEST_MODE only.
  return <ArcadeView fail={env.testMode && fail === "1"} />;
}
