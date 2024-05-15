export interface NFT {
  id: string;
  name: string;
  image: string;
}
export const prepareNFTData = async (tokenId: string, tokenUri: string) => {
  const res = await fetch(
    tokenUri.replace("ipfs://", "https://ipfs.tech/ipfs/")
  );
  const data = await res.json();
  return {
    id: tokenId,
    name: data.name,
    image: data.image.replace("ipfs://", "https://ipfs.tech/ipfs/"),
  };
};

export const formatAddress = (address: string) => {
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
};
