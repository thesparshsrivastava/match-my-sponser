import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { CacheBuster } from '@/components/shared/CacheBuster';
import { PWAInstallPrompt } from '@/components/shared/PWAInstallPrompt';
import { OfflineIndicator } from '@/components/shared/OfflineIndicator';
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL('https://matchmysponsor.com'),
  title: {
    default: "Match My Sponsor - Connect Events with Sponsors",
    template: "%s | Match My Sponsor"
  },
  description: "The #1 AI-powered platform connecting event organizers with sponsors. Find perfect sponsorship opportunities for hackathons, conferences, sports events, and cultural festivals.",
  keywords: ['event sponsorship', 'sponsor matching', 'event organizer', 'sponsor platform', 'hackathon sponsors', 'conference sponsorship', 'sports event sponsors', 'cultural event funding', 'startup events', 'tech conferences', 'AI sponsorship matching'],
  authors: [{ name: 'Sparsh Srivastava', url: 'https://github.com/thesparshsrivastava' }],
  creator: 'Sparsh Srivastava',
  publisher: 'Sparsh Srivastava',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://matchmysponsor.com',
    title: 'Match My Sponsor - Connect Events with Sponsors',
    description: 'AI-powered platform connecting event organizers with sponsors. Find perfect matches for hackathons, conferences, and cultural events.',
    siteName: 'Match My Sponsor',
    images: [{
      url: '/og-image.png',
      width: 1200,
      height: 630,
      alt: 'Match My Sponsor - Event Sponsorship Platform',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Match My Sponsor - Connect Events with Sponsors',
    description: 'AI-powered platform connecting event organizers with sponsors.',
    images: ['/og-image.png'],
    creator: '@matchmysponsor',
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/icon.png', type: 'image/png', sizes: '192x192' },
    ],
    apple: [{ url: '/apple-icon.png', sizes: '180x180' }],
    shortcut: '/favicon.ico',
  },
  verification: {
    google: 'your-google-verification-code',
  },
  category: 'technology',
  applicationName: 'Match My Sponsor',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://vercel.live" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="preload" href="/logo.png" as="image" />
        <meta name="theme-color" content="#667eea" />
        <meta name="color-scheme" content="light" />
        <link rel="canonical" href="https://matchmysponsor.com" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="MatchMySponser" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Match My Sponsor",
              "description": "AI-powered platform connecting event organizers with sponsors",
              "url": "https://matchmysponsor.com",
              "applicationCategory": "BusinessApplication",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              }
            })
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div>
          <ErrorBoundary>
            <CacheBuster />
            {children}
            <PWAInstallPrompt />
            <OfflineIndicator />
          </ErrorBoundary>
        </div>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}