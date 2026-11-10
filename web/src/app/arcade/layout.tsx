import ArcadeShell from "./ArcadeShell";

/** /arcade: public. Anyone can browse and open games without an account. */
export default function ArcadeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ArcadeShell>{children}</ArcadeShell>;
}
