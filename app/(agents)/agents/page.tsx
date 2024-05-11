"use client";
import { BasedPunksList } from "@/components/BasedPunksList";
import { NFT } from "@/lib/nft-utils";
import { Image } from "@nextui-org/react";
import { useState } from "react";
import { useAccount } from "wagmi";

export default function Agents() {
  const { isConnected, address } = useAccount();
  const [selectedNFT, setSelectedNFT] = useState<NFT>();
  return (
    <main className="bg-white flex min-h-screen min-w-screen flex-col p-16 gap-4">
      <div className="flex flex-col gap-4 justify-center items-center">
        <div className="text-8xl text-primary">Your Based Punks</div>
        <div className="flex flex-row gap-x-8 justify-center">
          <div className="flex flex-col gap-4 items-start">
            {address && (
              <BasedPunksList owner={address} setSelectedNFT={setSelectedNFT} />
            )}
          </div>
          {selectedNFT && (
            <div className="flex flex-col gap-4 items-start bg-primary rounded-3xl p-8">
              <div className="flex flex-row items-center gap-4 bg-white/15 p-4 rounded-xl">
                <Image
                  src={selectedNFT.image}
                  alt="selected-nft-image"
                  className="h-16 rounded-full"
                />
                <div className="text-3xl text-white">{selectedNFT.name}</div>
              </div>
              <div className="flex flex-col gap-4 items-start bg-primary/50 rounded-3xl p-8">
                text
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
