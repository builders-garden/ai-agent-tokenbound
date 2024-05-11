import { NftCollectionsQueryQuery, NftQueryQuery } from "./types";
import { fetchQuery, init } from "@airstack/node";

if (!process.env.NEXT_PUBLIC_AIRSTACK_API_KEY) {
  throw new Error("NEXT_PUBLIC_AIRSTACK_API_KEY is missing");
}

init(process.env.NEXT_PUBLIC_AIRSTACK_API_KEY!);

export const collectionsQuery = /* GraphQL */ `
  query NFTCollectionsQuery($owner: Identity!, $tokenAddresses: [Address!]) {
    TokenBalances(
      input: {
        filter: {
          owner: { _eq: $owner }
          tokenAddress: { _in: $tokenAddresses }
        }
        blockchain: base
      }
    ) {
      TokenBalance {
        tokenNfts {
          tokenId
          tokenURI
        }
      }
    }
  }
`;

export interface CollectionsQueryResponse {
  data: NftCollectionsQueryQuery | null;
  error: Error | null;
}

interface Error {
  message: string;
}

export const fetchNFTCollectionsData = async (
  owner: string,
  tokenAddresses: string[]
) => {
  const { data, error }: CollectionsQueryResponse = await fetchQuery(
    collectionsQuery,
    {
      owner,
      tokenAddresses,
    }
  );
  if (
    error ||
    !data ||
    !data.TokenBalances ||
    !data.TokenBalances.TokenBalance ||
    data.TokenBalances.TokenBalance?.length === 0
  ) {
    return [];
  }
  return data.TokenBalances.TokenBalance;
};

export const nftQuery = /* GraphQL */ `
  query NFTQuery($tokenAddresses: [Address!], $tokenId: String!) {
    TokenBalances(
      input: {
        filter: {
          tokenAddress: { _in: $tokenAddresses }
          tokenId: { _eq: $tokenId }
        }
        blockchain: base
      }
    ) {
      TokenBalance {
        id
        amount
      }
    }
  }
`;

export interface NFTBalanceQueryResponse {
  data: NftQueryQuery | null;
  error: Error | null;
}

interface Error {
  message: string;
}

export const fetchNFTData = async (
  owner: string,
  tokenAddresses: string[],
  tokenId: string
) => {
  const { data, error }: NFTBalanceQueryResponse = await fetchQuery(nftQuery, {
    owner,
    tokenAddresses,
    tokenId,
  });
  if (
    error ||
    !data ||
    !data.TokenBalances ||
    !data.TokenBalances.TokenBalance ||
    data.TokenBalances.TokenBalance?.length === 0
  ) {
    return [];
  }
  return data.TokenBalances.TokenBalance;
};
