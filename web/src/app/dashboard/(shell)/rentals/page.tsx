import type { Metadata } from "next";
import ConsoleMarket from "@/components/dashboard/ConsoleMarket";

export const metadata: Metadata = { title: "Rentals" };

export default async function RentalsPage({
  searchParams,
}: {
  searchParams: Promise<{ game?: string | string[] }>;
}) {
  const { game } = await searchParams;
  return (
    <ConsoleMarket preSelectedGameId={typeof game === "string" ? game : null} />
  );
}
