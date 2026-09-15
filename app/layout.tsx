import type { Metadata } from "next";
import "./globals.css";
import "./events.css";
import "./fashion.css";
import IntroGate from "./IntroGate";

export const metadata: Metadata = {
  title: "NAC Amatori Castellana",
  description: "Passione, unità, rispetto.",
  icons: { icon: "/nac-scudetto.png" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="it"><body><IntroGate />{children}</body></html>;
}
