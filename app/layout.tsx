import type { Metadata } from "next";
import "./globals.css";
import { Footer, Header, MobileBar } from "@/components/Chrome";
import SlipDrawer, { Toast } from "@/components/SlipDrawer";
import { SlipProvider } from "@/components/SlipProvider";

export const metadata: Metadata = {
  title: { default: "Medcloud Labs — Tests, prices and booking", template: "%s | Medcloud Labs" },
  description: "Medcloud diagnostics: 360+ pathology and radiology tests with upfront prices, home sample collection, and four centres across Mandya, Malavalli, Kunigal and Ramanagara.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Swap for next/font/google if you prefer self-hosted fonts; the CSS reads --font-display/--font-body/--font-mono. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=Instrument+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap" />
      </head>
      <body>
        <SlipProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <MobileBar />
          <SlipDrawer />
          <Toast />
        </SlipProvider>
      </body>
    </html>
  );
}
