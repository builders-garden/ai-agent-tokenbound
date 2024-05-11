import { NftBalanceQueryQuery } from "./types";
import { fetchQuery, init } from "@airstack/node";

if (!process.env.AIRSTACK_API_KEY) {
  throw new Error("AIRSTACK_API_KEY is missing");
}

init(process.env.AIRSTACK_API_KEY!);

const collectionsQuery = /* GraphQL */ `
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
        id
        amount
      }
    }
  }
`;

interface QueryResponse {
  data: NftBalanceQueryQuery | null;
  error: Error | null;
}

interface Error {
  message: string;
}

export const fetchNFTCollectionsData = async (
  owner: string,
  tokenAddresses: string[]
) => {
  const { data, error }: QueryResponse = await fetchQuery(collectionsQuery, {
    owner,
    tokenAddresses,
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

const nftQuery = /* GraphQL */ `
  query NFTBalanceQuery(
    $owner: Identity!
    $tokenAddresses: [Address!]
    $tokenId: String!
  ) {
    TokenBalances(
      input: {
        filter: {
          owner: { _eq: $owner }
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

export const fetchNFTData = async (
  owner: string,
  tokenAddresses: string[],
  tokenId: string
) => {
  const { data, error }: QueryResponse = await fetchQuery(nftQuery, {
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
