import type { Metadata } from "next";
import NewGameView from "./NewGameView";

export const metadata: Metadata = { title: "New game" };

export default function NewGamePage() {
  return <NewGameView />;
}
