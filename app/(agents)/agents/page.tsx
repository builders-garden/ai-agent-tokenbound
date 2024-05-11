"use client";
import { BasedPunkChat } from "@/components/BasedPunkChat";
import { BasedPunksList } from "@/components/BasedPunksList";
import { NFT } from "@/lib/utils";
import { Image } from "@nextui-org/react";
import { useState } from "react";
import { useAccount } from "wagmi";

export default function Agents() {
  const { isConnected, address } = useAccount();
  const [selectedNFT, setSelectedNFT] = useState<NFT>();
  return (
    <main className="bg-white flex max-h-screen max-w-screen flex-col p-16 gap-4">
      <div className="flex flex-col gap-4 justify-center items-center">
        <div className="text-8xl text-primary">Your Based Punks</div>
        <div className="flex flex-row gap-x-8 justify-center">
          {address && isConnected && (
            <>
              <div className="flex flex-col gap-4 items-start">
                <BasedPunksList
                  owner={address}
                  setSelectedNFT={setSelectedNFT}
                />
              </div>
              <BasedPunkChat nft={selectedNFT} />
            </>
          )}
        </div>
      </div>
    </main>
  );
}
