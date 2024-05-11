"use client";
import { Button, Image } from "@nextui-org/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Jersey_15_Charted } from "next/font/google";
import Link from "next/link";
import { useAccount } from "wagmi";
const jersey = Jersey_15_Charted({ subsets: ["latin"], weight: "400" });

export default function Home() {
  const { isConnected } = useAccount();
  return (
    <main className="bg-white flex min-h-screen min-w-screen flex-col items-center justify-evenly p-24 gap-4">
      <div className="flex flex-col gap-4 items-center">
        <div className="text-8xl text-primary">
          <div className={jersey.className}>Based Agents</div>
        </div>
        <div className="text-2xl text-primary">
          Animate your Based Punks to streamline on-chain transactions
        </div>
        {isConnected ? (
          <Link href="agents">
            <Button color="primary" className="text-2xl">
              Start now
            </Button>
          </Link>
        ) : (
          <ConnectButton />
        )}
      </div>
      <div className="flex flex-row gap-4 justify-start items-start">
        <Image src="based-punks.gif" alt="based-punk-1" className="max-h-48" />
      </div>
    </main>
  );
}
