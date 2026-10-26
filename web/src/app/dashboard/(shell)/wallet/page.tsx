import type { Metadata } from "next";
import WalletView from "@/components/dashboard/WalletView";

export const metadata: Metadata = { title: "Wallet" };

export default function WalletPage() {
  return <WalletView />;
}
