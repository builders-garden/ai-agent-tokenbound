import { TokenboundClient } from "@tokenbound/sdk";
// execute transaction
export async function executeTransaction({
  tokenboundClient,
  account,
  to,
  value,
  data,
}: {
  tokenboundClient: TokenboundClient;
  account: string;
  to: string;
  value: string;
  data: string;
}): Promise<{ txHash: string }> {
  const txHash = await tokenboundClient.execute({
    account: account as `0x${string}`,
    to: to as `0x${string}`,
    value: BigInt(value),
    data: data || "",
  });
  return { txHash };
}
