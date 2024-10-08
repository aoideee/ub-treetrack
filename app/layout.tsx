// Common Layout

import { Inter } from "next/font/google";
import "@/styles/globals.css";

import type { Metadata } from "next";

import Header from "@/components/header";
import Footer from "@/components/footer";
import { Toaster } from "@/components/ui/toaster";

// font setup
const inter = Inter({ subsets: ["latin"] });

// metadata
export const metadata: Metadata = {
  title: "UB TreeTrack",
  description: "Plant tracker for the University of Belize Belmopan Campus",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg`}>
        <Header />
        <main>{children}</main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
