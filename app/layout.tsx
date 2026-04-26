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
import { site } from "@/lib/config";

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
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen bg-bg text-text antialiased">
        <PostHogProvider>
          <SmoothScrollProvider>
            <ViewTransitions>
              <Navbar />
              <main className="relative">{children}</main>
              <Footer />
            </ViewTransitions>
          </SmoothScrollProvider>
          <CommandPalette />
          <KonamiWatcher />
        </PostHogProvider>
      </body>
    </html>
  );
}
