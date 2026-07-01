import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/shell/Navbar";
import { Footer } from "@/components/shell/Footer";
import { CommandPalette } from "@/components/shell/CommandPalette";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { KonamiWatcher } from "@/components/providers/KonamiWatcher";
import { ViewTransitions } from "@/components/providers/ViewTransitions";
import { PostHogProvider } from "@/components/providers/PostHogProvider";
import { ConsoleBanner } from "@/components/providers/ConsoleBanner";
import { EasterEggToaster } from "@/components/providers/EasterEggToaster";
import { ShortcutsOverlay } from "@/components/providers/ShortcutsOverlay";
import { IdleGlitch } from "@/components/providers/IdleGlitch";
import { site } from "@/lib/config";

// A breadcrumb for anyone who reads the page source — recon move #1.
const RECON_COMMENT = `
  nmap scan report for ${new URL(site.baseUrl).host}
  PORT      STATE     SERVICE
  80/tcp    open      http
  443/tcp   open      https
  1337/tcp  filtered  root-shell   # try the contra code: ↑ ↑ ↓ ↓ ← → ← → b a
`;

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.baseUrl),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s · ${site.name}`,
  },
  description: site.bio,
  openGraph: {
    type: "website",
    url: site.baseUrl,
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.bio,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: site.bio,
  },
  icons: { icon: "/favicon.svg" },
  alternates: {
    types: {
      "application/rss+xml": [{ url: "/feed.xml", title: `${site.name} — blog` }],
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0f0a",
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
      className={`${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-bg text-text antialiased">
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var m=localStorage.getItem('reading');if(m)document.documentElement.setAttribute('data-reading',m)}catch(e){}",
          }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[300] focus:rounded-sm focus:border focus:border-primary focus:bg-bg-panel focus:px-3 focus:py-2 focus:font-mono focus:text-sm focus:text-primary"
        >
          skip to content
        </a>
        <div
          hidden
          aria-hidden
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: `<!--${RECON_COMMENT}-->` }}
        />
        <PostHogProvider>
          <SmoothScrollProvider>
            <ViewTransitions>
              <Navbar />
              <main id="main" className="relative">{children}</main>
              <Footer />
            </ViewTransitions>
          </SmoothScrollProvider>
          <CommandPalette />
          <KonamiWatcher />
          <ShortcutsOverlay />
          <EasterEggToaster />
          <ConsoleBanner />
          <IdleGlitch />
        </PostHogProvider>
      </body>
    </html>
  );
}
