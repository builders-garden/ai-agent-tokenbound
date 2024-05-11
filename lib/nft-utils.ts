export interface NFT {
  id: string;
  name: string;
  image: string;
}
export const prepareNFTData = async (tokenId: string, tokenUri: string) => {
  const res = await fetch(tokenUri.replace("ipfs://", "https://ipfs.io/ipfs/"));
  const data = await res.json();
  return {
    id: tokenId,
    name: data.name,
    image: data.image.replace("ipfs://", "https://ipfs.io/ipfs/"),
  };
};
