import type { Metadata } from "next";
import GameLibrary from "@/components/dashboard/GameLibrary";

export const metadata: Metadata = { title: "Game Library" };

export default function LibraryPage() {
  return <GameLibrary />;
}
