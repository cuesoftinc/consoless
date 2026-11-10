import type { Metadata } from "next";
import StudioView from "./StudioView";

export const metadata: Metadata = { title: "Studio" };

export default async function StudioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <StudioView projectId={id} />;
}
