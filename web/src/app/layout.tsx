import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Press_Start_2P } from "next/font/google";
import SkipLink from "@/components/ui/SkipLink";
import ToastViewport from "@/components/ui/ToastViewport";
import { ToastProvider } from "@/controllers/toast";
import { ThemeProvider, themeInitScript } from "@/design/ThemeProvider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const pressStart2P = Press_Start_2P({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-press-start-2p",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Consoless",
    template: "%s | Consoless",
  },
  description:
    "Describe a game and play it in your browser. Consoless is an open-source platform for making retro, 2D and 3D games by chatting.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // suppressHydrationWarning: the pre-paint script sets data-theme before
    // React hydrates.
    <html
      lang="en"
      className={`${inter.variable} ${pressStart2P.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-gaming-900 text-white h-screen overflow-hidden selection:bg-gaming-accent selection:text-white">
        {/* Apply the stored theme before first paint (no flash). */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <SkipLink />
        <ThemeProvider>
          <ToastProvider>
            {children}
            <ToastViewport />
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
