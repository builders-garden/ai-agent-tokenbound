import { NFT } from "@/lib/utils";
import { getAccount } from "@/lib/tokebound/account";
import { TokenboundClient } from "@tokenbound/sdk";
import { useCallback, useEffect, useState } from "react";
import { base } from "viem/chains";
import { useWalletClient } from "wagmi";

export const useTokenboundAccount = ({ nft }: { nft: NFT }) => {
  const [account, setAccount] = useState<string>("");
  const [isDeployed, setIsDeployed] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const { data: walletClient } = useWalletClient();
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const tokenboundClient = new TokenboundClient({
        // @ts-ignore
        walletClient,
        chainId: base.id,
      });
      const { isDeployed, tokenboundAccountAddress } = await getAccount({
        tokenboundClient,
        tokenId: nft.id,
      });
      setAccount(tokenboundAccountAddress);
      setIsDeployed(isDeployed);
    } catch (e: Error | any) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, [nft, walletClient]); // Add an empty array as the second argument

  useEffect(() => {
    if (nft) {
      fetchData();
    }
  }, [fetchData, nft, walletClient]);

  if (!nft) return { data: null, loading: false, error: null, fetch: () => {} };

  return {
    data: {
      account,
      isDeployed,
    },
    loading,
    error,
    refetch: fetchData,
  };
};
