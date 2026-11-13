import type { Metadata } from "next";
import "./globals.css";
import { Footer, MobileBar } from "@/components/Chrome";
import { GlowTracker } from "@/components/Fx";
import Header from "@/components/Header";
import ThemeToggle from "@/components/ThemeToggle";
import SlipDrawer, { Toast } from "@/components/SlipDrawer";
import { SlipProvider } from "@/components/SlipProvider";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://medcloud-v2.vercel.app"),
  title: { default: "Medcloud Labs — Tests, prices and booking", template: "%s | Medcloud Labs" },
  description: "Medcloud diagnostics: 360+ pathology and radiology tests with upfront prices, home sample collection, and four centres across Mandya, Malavalli, Kunigal and Ramanagara.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `try{var t=localStorage.getItem("mc-theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}` }} />
        {/* Swap for next/font/google if you prefer self-hosted fonts; the CSS reads --font-display/--font-body/--font-mono. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&family=Instrument+Serif:ital@1&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap" />
        <noscript><style>{`.rv{opacity:1!important;transform:none!important}.splash{display:none}`}</style></noscript>
      </head>
      <body>
        <SlipProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <MobileBar />
          <SlipDrawer />
          <ThemeToggle className="side" />
          <Toast />
          <GlowTracker />
        </SlipProvider>
      </body>
    </html>
  );
}
