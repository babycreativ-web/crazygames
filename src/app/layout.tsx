import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import MainLayout from "@/components/MainLayout";
import { Suspense } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CrazyArcade - Play Free Online HTML5 Games",
  description: "Play thousands of free online games directly in your browser. Action, arcade, puzzles, driving, and more with no downloads required!",
  keywords: "free online games, HTML5 games, web browser games, arcade, play now, crazy games clone",
  authors: [{ name: "CrazyArcade" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full bg-slate-950 text-slate-100 flex flex-col font-sans">
        <Suspense fallback={
          <div className="flex h-screen w-screen items-center justify-center bg-slate-950 text-slate-400">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-500 border-t-transparent"></div>
              <span className="text-sm font-medium">Loading CrazyArcade...</span>
            </div>
          </div>
        }>
          <MainLayout>{children}</MainLayout>
        </Suspense>
      </body>
    </html>
  );
}
