import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Muhammed Veysel Erkoyuncu | Portfolio",
  description: "AI & Data Scientist Portfolio of Muhammed Veysel Erkoyuncu",
  openGraph: {
    title: 'Muhammed Veysel Erkoyuncu | Portfolio',
    description: 'AI & Data Scientist Portfolio',
    url: 'https://veyse.net', // Assuming this might be the domain, or leave generic
    siteName: 'Muhammed Veysel Erkoyuncu',
    images: [
      {
        url: '/images/ProfilePhoto.png', // Use local image if available or generic
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Muhammed Veysel Erkoyuncu',
    description: 'AI & Data Scientist Portfolio',
    images: ['/images/ProfilePhoto.png'],
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
