import { NFT } from "@/lib/nft-utils";
import { createAccount, getAccount } from "@/lib/tokebound/account";
import { TokenboundClient } from "@tokenbound/sdk";
import { useCallback, useEffect, useState } from "react";
import { base } from "viem/chains";
import { useWalletClient } from "wagmi";

export const useCreateTokenboundAccount = ({ nft }: { nft: NFT }) => {
  const [account, setAccount] = useState<string>("");
  const [isDeployed, setIsDeployed] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const { data: walletClient } = useWalletClient();
  const createTokenBoundAccount = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const tokenboundClient = new TokenboundClient({
        // @ts-ignore
        walletClient,
        chainId: base.id,
      });
      const tokenboundAccountAddress = await createAccount({
        tokenboundClient,
        tokenId: nft.id,
      });
      setAccount(tokenboundAccountAddress);
      setIsDeployed(true);
    } catch (e: Error | any) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, [nft, walletClient]); // Add an empty array as the second argument

  return createTokenBoundAccount;
};
