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
    <main className="bg-white flex max-h-screen max-w-screen flex-col items-center justify-between p-24 gap-48">
      <div className="flex flex-col items-center justify-evenly gap-4">
        <div className="flex flex-col gap-4 items-center">
          <div className="text-8xl text-primary">
            <div className={jersey.className}>Based Agents</div>
          </div>
          <div className="text-2xl text-primary">
            Transform your Based Punks in an AI-powered personal agent
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
          <Image
            src="based-punks.gif"
            alt="based-punk-1"
            className="max-h-64"
          />
        </div>
      </div>
      <div className="flex flex-col gap-4 items-center">
        <div className="text-primary text-xl text-center items-center flex flex-row gap-2">
          powered by{" "}
          <a
            href="https://brianknows.org"
            target="_blank"
            className="underline decoration-blue-500 decoration-solid"
          >
            <Image src={"brian-logo.svg"} alt="brian-logo" className="h-6" />
          </a>
        </div>

        <div className="text-primary">
          built with ❤️ by{" "}
          <a
            href="https://builders.garden"
            target="_blank"
            className="underline decoration-blue-500 decoration-solid "
          >
            builders.garden
          </a>
        </div>
      </div>
    </main>
  );
}
