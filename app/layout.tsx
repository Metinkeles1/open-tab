import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppHeader from "@/components/layout/AppHeader";
import AppContainer from "@/components/layout/AppContainer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Open Tab",
  description: "Veresiye Takip Sistemi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="bg-slate-900">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-900 text-slate-100 h-screen overflow-hidden flex flex-col`}
      >
        <AppHeader />
        <main className="flex-1 overflow-hidden">
          <AppContainer>{children}</AppContainer>
        </main>
      </body>
    </html>
  );
}
