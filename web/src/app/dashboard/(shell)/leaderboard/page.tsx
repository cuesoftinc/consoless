import type { Metadata } from "next";
import Leaderboard from "@/components/dashboard/Leaderboard";

export const metadata: Metadata = { title: "Leaderboard" };

export default function LeaderboardPage() {
  return <Leaderboard />;
}
