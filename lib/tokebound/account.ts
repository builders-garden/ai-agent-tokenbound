import { TokenboundClient } from '@tokenbound/sdk'
import { base } from 'viem/chains'

// get tokenbound account
export async function getAccount({
  tokenboundClient,
  tokenId,
}: {
  tokenboundClient: TokenboundClient
  tokenId: string
}): Promise<{ account: string }> {

    const collection = process.env.NFT_COLLECTION_ADDRESS
    const account = tokenboundClient.getAccount({
        tokenContract: collection as `0x${string}`,
        tokenId,
    })
  
    return { account}
}

// get NFT from account
export async function getNFT({
  tokenboundClient,
  account,
}: {
  tokenboundClient: TokenboundClient
  account: string
}): Promise<{ tokenContract: string, tokenId: string, chainId: number }> {
    const nft = await tokenboundClient.getNFT({
        accountAddress: account as `0x${string}`,
    })
    const { tokenContract, tokenId, chainId } = nft

    return { tokenContract, tokenId, chainId }
}

// Create a new account
export async function createAccount({
  tokenboundClient,
  tokenId,
}: {
    tokenboundClient: TokenboundClient,
    tokenId: string
}): Promise<{ account: string }> {
    const params = {
        tokenContract: process.env.NFT_COLLECTION_ADDRESS as `0x${string}`,
        tokenId: tokenId!,
        chainId: base.id,
    }

    const { account, txHash } = await tokenboundClient.createAccount(params)

    return { account}
}