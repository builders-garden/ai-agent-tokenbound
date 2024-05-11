import { NFT } from "@/lib/utils";
import { createAccount, getAccount } from "@/lib/tokebound/account";
import { TokenboundClient } from "@tokenbound/sdk";
import { useCallback, useEffect, useState } from "react";
import { base } from "viem/chains";
import { useWalletClient } from "wagmi";

export const useCreateTokenboundAccount = ({ nft }: { nft: NFT }) => {
  const { data: walletClient } = useWalletClient();
  const createTokenBoundAccount = useCallback(async () => {
    const tokenboundClient = new TokenboundClient({
      // @ts-ignore
      walletClient,
      chainId: base.id,
    });
    const tokenboundAccountAddress = await createAccount({
      tokenboundClient,
      tokenId: nft.id,
    });
    return tokenboundAccountAddress;
  }, [nft, walletClient]); // Add an empty array as the second argument

  return createTokenBoundAccount;
};
