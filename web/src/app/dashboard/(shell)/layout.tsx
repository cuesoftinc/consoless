import Navbar from "@/components/dashboard/Navbar";

export default function ShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gaming-900 text-white font-sans">
      <Navbar />

      <main id="main" tabIndex={-1} className="flex-1 overflow-hidden relative">
        <div
          aria-hidden="true"
          className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-gaming-800 to-transparent pointer-events-none"
        />
        <div
          aria-hidden="true"
          className="absolute -top-20 -right-20 w-96 h-96 bg-gaming-accent/10 rounded-full blur-3xl pointer-events-none"
        />
        <div
          aria-hidden="true"
          className="absolute top-40 -left-20 w-72 h-72 bg-gaming-neon/5 rounded-full blur-3xl pointer-events-none"
        />

        <div className="relative h-full z-10">{children}</div>
      </main>
    </div>
  );
}
