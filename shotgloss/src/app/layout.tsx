import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "ShotGloss — Beautiful screenshots & code images in seconds",
    template: "%s — ShotGloss",
  },
  description:
    "Paste a screenshot or code snippet and get a polished, share-ready image: gradient background, window frame, shadow, perfect sizing for Twitter/X, Open Graph and Instagram. Free, in your browser.",
  openGraph: {
    title: "ShotGloss — Beautiful screenshots & code images in seconds",
    description:
      "Turn plain screenshots and code snippets into polished social images. Runs entirely in your browser.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
