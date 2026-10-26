import type { Metadata } from "next";
import TournamentHub from "@/components/dashboard/TournamentHub";

export const metadata: Metadata = { title: "Tournaments" };

export default function TournamentsPage() {
  return <TournamentHub />;
}
