
// get tokenbound account
export async function getAccount({
  tokenId,
}: {
  tokenId: string
}): Promise<{ account: string; txHash: string }> {

  const collection = process.env.NFT_COLLECTION_ADDRESS
  
  return { account, txHash: account.txHash }
}
