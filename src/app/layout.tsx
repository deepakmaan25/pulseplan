import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { AppProviders } from "@/components/providers";
import { THEME_MEDIA_QUERY, THEME_STORAGE_KEY } from "@/lib/theme/constants";
import "@/styles/globals.css";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PulsePlan",
  description: "A premium content planner for solo creators.",
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F2F4F7" },
    { media: "(prefers-color-scheme: dark)", color: "#0A0C0F" },
  ],
};

/**
 * No-flash boot script. Runs synchronously before React hydrates. Reads the
 * stored theme defensively (privacy modes can throw on localStorage access),
 * then adds the `dark` class to <html> when the resolved theme is dark.
 * Mirrors ThemeProvider's resolution logic exactly — both modules import the
 * storage key and media query from `@/lib/theme/constants`.
 */
const noFlashScript = `(function(){try{var k=${JSON.stringify(THEME_STORAGE_KEY)};var s=null;try{s=localStorage.getItem(k);}catch(e){}var m=false;try{m=window.matchMedia(${JSON.stringify(THEME_MEDIA_QUERY)}).matches;}catch(e){}var d=s==="dark"||((s===null||s==="auto")&&m);if(d){document.documentElement.classList.add("dark");}}catch(e){}})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`pp2 ${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: noFlashScript }} />
      </head>
      <body>
        <AppProviders>{children}</AppProviders>
        <Analytics />
      </body>
    </html>
  );
}
