import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import QueryProvider from "@/providers/QueryProvider";
import BackendWarmup from "@/components/common/BackendWarmup";
import { ToastProvider } from "@/providers/ToastProvider";

const clashGrotesk = localFont({
  src: "../assets/font/clash-grotesk/ClashGrotesk-Variable.ttf",
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
          <ToastProvider>
            <BackendWarmup />
            <Navbar />
            {children}
            <Footer />
          </ToastProvider>
        </QueryProvider>
      </body>
    </html>
  );
}