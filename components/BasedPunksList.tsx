"use client";
import { collectionsQuery } from "@/lib/airstack";
import { NftCollectionsQueryQuery } from "@/lib/airstack/types";
import { BASED_PUNKS_COLLECTION_ADDRESS } from "@/lib/constants";
import { useQuery } from "@airstack/airstack-react";
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import { Spinner } from "@nextui-org/spinner";
import { Button, Image } from "@nextui-org/react";
import { NFT, prepareNFTData } from "@/lib/utils";

export const BasedPunksList = ({
  owner,
  setSelectedNFT,
}: {
  owner: string;
  setSelectedNFT: (nft: NFT) => void;
}) => {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(true);
  const { data, error } = useQuery<NftCollectionsQueryQuery>(
    collectionsQuery,
    { owner, tokenAddresses: [BASED_PUNKS_COLLECTION_ADDRESS] },
    { cache: false }
  );
  useEffect(() => {
    if (data) {
      const prepareNfts = async () => {
        const tokens = await Promise.all(
          data.TokenBalances?.TokenBalance!.map((token) =>
            prepareNFTData(
              token.tokenNfts?.tokenId!,
              token.tokenNfts?.tokenURI!
            )
          )!
        );
        setNfts(tokens);
        setLoading(false);
      };
      prepareNfts();
    }
  }, [data]);
  if (loading) {
    return (
      <div className="p-16">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div className="flex flex-col gap-4 bg-primary rounded-3xl p-4">
      {nfts.map((nft) => (
        <div
          key={nft.id}
          className="flex flex-col items-center text-primary gap-2"
          onClick={() => setSelectedNFT(nft)}
        >
          <Image
            src={nft.image}
            alt="nft-image"
            className="w-24 rounded-full"
          />
        </div>
      ))}
    </div>
  );
};
