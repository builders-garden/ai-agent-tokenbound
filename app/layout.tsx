import type { Metadata } from "next";
import { VT323 } from "next/font/google";
import "@rainbow-me/rainbowkit/styles.css";
import "./globals.css";
import { NextUIProvider } from "@nextui-org/react";
import { Navbar } from "@/components/Navbar";
import { AirstackProvider } from "@airstack/airstack-react";
import Providers from "@/components/Providers";

const raleway = VT323({ subsets: ["latin"], weight: "400" });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={raleway.className}>
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
