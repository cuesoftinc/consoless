import type { Metadata, Viewport } from "next";
import { Inter, Press_Start_2P } from "next/font/google";
import SkipLink from "@/components/ui/SkipLink";
import ToastViewport from "@/components/ui/ToastViewport";
import { ToastProvider } from "@/controllers/toast";
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
    <html
      lang="en"
      data-theme="dark"
      className={`${inter.variable} ${pressStart2P.variable}`}
    >
      <body className="bg-gaming-900 text-white h-screen overflow-hidden selection:bg-gaming-accent selection:text-white">
        <SkipLink />
        <ToastProvider>
          {children}
          <ToastViewport />
        </ToastProvider>
      </body>
    </html>
  );
}
