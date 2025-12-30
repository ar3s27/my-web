import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "My Personal Portfolio",
  description: "Showcasing my projects and skills",
  openGraph: {
    title: 'My Personal Portfolio',
    description: 'Showcasing my projects and skills',
    url: 'https://mywebsite.com',
    siteName: 'My Portfolio',
    images: [
      {
        url: 'https://mywebsite.com/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'My Personal Portfolio',
    description: 'Showcasing my projects and skills',
    images: ['https://mywebsite.com/og-image.png'],
  },
};

import { Providers } from "@/components/providers";
import { LanguageProvider } from "@/context/LanguageContext";
import StatsTracker from "@/components/StatsTracker";
import ScrollToTop from "@/components/ScrollToTop";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <LanguageProvider>
          <Providers>
            <StatsTracker />
            <ScrollToTop />
            {children}
          </Providers>
        </LanguageProvider>
      </body>
    </html>
  );
}
