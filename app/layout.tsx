import type { Metadata } from "next";
import { VT323 } from "next/font/google";
import "@rainbow-me/rainbowkit/styles.css";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import Providers from "@/components/Providers";

const raleway = VT323({ subsets: ["latin"], weight: "400" });

export const metadata: Metadata = {
  title: "Based Agents",
  description: "Animate your Based Punks with BrianAI",
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
