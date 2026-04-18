import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vuln Art Shop — Discover & Collect Extraordinary Art",
  description: "A modern art marketplace where creativity meets collection. Browse, buy, rent, and auction extraordinary artworks from world-class artists.",
  keywords: ["art", "gallery", "auction", "marketplace", "collect", "Vuln Art"],
  icons: {
    icon: "/logo.svg",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <footer className="border-t border-border/40 bg-muted/30">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      © 2024 Vuln Art Shop. All rights reserved.
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <a href="#" className="hover:text-foreground transition-colors">Terms</a>
                    <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
                    <a href="#" className="hover:text-foreground transition-colors">Contact</a>
                  </div>
                </div>
              </div>
            </footer>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
