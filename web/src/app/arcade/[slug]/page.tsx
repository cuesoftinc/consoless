import type { Metadata } from "next";
import GameView from "./GameView";

export const metadata: Metadata = { title: "Game" };

export default async function GamePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <GameView slug={slug} />;
}
