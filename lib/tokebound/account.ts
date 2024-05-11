import { TokenboundClient } from "@tokenbound/sdk";
import { base } from "viem/chains";
import { BASED_PUNKS_COLLECTION_ADDRESS } from "../constants";

// get tokenbound account
export async function getAccount({
  tokenboundClient,
  tokenId,
}: {
  tokenboundClient: TokenboundClient;
  tokenId: string;
}): Promise<{
  isDeployed: boolean;
  tokenboundAccountAddress: string;
}> {
  const collection = BASED_PUNKS_COLLECTION_ADDRESS;
  const tokenboundAccountAddress = tokenboundClient.getAccount({
    tokenContract: collection as `0x${string}`,
    tokenId,
  });
  const isAccountDeployed = await tokenboundClient.checkAccountDeployment({
    accountAddress: tokenboundAccountAddress as `0x${string}`,
  });
  console.log({
    collection,
    tokenboundAccountAddress,
    isAccountDeployed,
  });
  return {
    isDeployed: isAccountDeployed,
    tokenboundAccountAddress,
  };
}

// get NFT from account
export async function getNFT({
  tokenboundClient,
  account,
}: {
  tokenboundClient: TokenboundClient;
  account: string;
}): Promise<{ tokenContract: string; tokenId: string; chainId: number }> {
  const nft = await tokenboundClient.getNFT({
    accountAddress: account as `0x${string}`,
  });
  const { tokenContract, tokenId, chainId } = nft;

  return { tokenContract, tokenId, chainId };
}

// Create a new account
export async function createAccount({
  tokenboundClient,
  tokenId,
}: {
  tokenboundClient: TokenboundClient;
  tokenId: string;
}): Promise<string> {
  const params = {
    tokenContract: BASED_PUNKS_COLLECTION_ADDRESS as `0x${string}`,
    tokenId: tokenId!,
    chainId: base.id,
  };
  console.log(params);
  const { account, txHash } = await tokenboundClient.createAccount(params);

  return account;
}
