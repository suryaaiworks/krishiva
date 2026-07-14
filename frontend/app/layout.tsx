import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { LanguageProvider } from "@/context/LanguageContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import type { Viewport } from "next";

export const viewport: Viewport = {
  themeColor: "#059669",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://krishiva.com"),
  title: "Krishiva | AI Farming Platform",
  description: "Empowering Farmers with AI using multilingual voice assistance, crop intelligence, weather forecasting, market insights and government schemes.",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Krishiva",
  },
  openGraph: {
    title: "Krishiva | AI Farming Platform",
    description: "Empowering Farmers with AI using multilingual voice assistance, crop intelligence, weather forecasting, market insights and government schemes.",
    url: "https://krishiva.com",
    siteName: "Krishiva",
    images: [
      {
        url: "/android-chrome-512.png",
        width: 512,
        height: 512,
        alt: "Krishiva Logo",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Krishiva | AI Farming Platform",
    description: "Empowering Farmers with AI using multilingual voice assistance, crop intelligence, weather forecasting, market insights and government schemes.",
    images: ["/android-chrome-512.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

