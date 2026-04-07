import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import QueryProvider from "@/providers/QueryProvider";
import BackendWarmup from "@/components/common/BackendWarmup";

const clashGrotesk = localFont({
  src: [
    {
      path: "./../../public/font/clash-grotesk/ClashGrotesk-Variable.ttf",
      style: "normal",
    },
  ],
  variable: "--font-clash",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Karughor",
  description: "Handcrafted products marketplace",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${clashGrotesk.variable} antialiased`}>
        <QueryProvider>
          <BackendWarmup />   {/* ← Wakes up Render backend immediately */}
          <Navbar />
          {children}
          <Footer />
        </QueryProvider>
      </body>
    </html>
  );
}