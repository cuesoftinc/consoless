import type { Metadata } from "next";
import { env } from "@/config/env";
import MyGamesView from "./MyGamesView";

export const metadata: Metadata = { title: "My Games" };

export default async function MyGamesPage({
  searchParams,
}: {
  searchParams: Promise<{ fail?: string }>;
}) {
  const { fail } = await searchParams;
  // `?fail=1` drives the error state, in TEST_MODE only.
  return <MyGamesView fail={env.testMode && fail === "1"} />;
}
