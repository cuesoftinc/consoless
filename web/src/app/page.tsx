import type { Metadata } from "next";
import HomeView from "@/components/home/HomeView";

const title = "Consoless: describe a game and play it";
const description =
  "Describe a game in plain language, pick a console style and play it in your browser. Consoless is an open-source platform for making games by chatting.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  openGraph: { title, description, type: "website", url: "/" },
  twitter: { card: "summary", title, description },
};

export default function HomePage() {
  return <HomeView />;
}
