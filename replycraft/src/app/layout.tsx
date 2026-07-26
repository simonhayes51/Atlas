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
    default: "ReplyCraft — AI review response generator for busy business owners",
    template: "%s — ReplyCraft",
  },
  description:
    "Paste any customer review and get a thoughtful, human-sounding owner response in seconds. Works for Google, Yelp, Trustpilot and TripAdvisor reviews, in any language. 10 free replies a month.",
  openGraph: {
    title: "ReplyCraft — AI review response generator",
    description:
      "Respond to every customer review in seconds, in your voice, in any language.",
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
