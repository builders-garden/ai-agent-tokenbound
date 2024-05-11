import { base } from "viem/chains";
import { BrianSDK } from "@brian-ai/sdk";

if (!process.env.BRIAN_API_KEY) {
  throw new Error("BRIAN_API_KEY is not set");
}

const options = {
  apiUrl: "https://staging-api.brianknows.org",
  apiKey: process.env.BRIAN_API_KEY!,
};

const brian = new BrianSDK(options);

export async function generateTransactionCalldata(
  prompt: string,
  address: string
): Promise<{
  description: string;
  to: string;
  data: string;
  value: string;
  approveNeeded?: boolean;
  fromTokenAddress?: string;
  fromTokenAmount?: string;
}> {
  const response = (await brian.transact({
    prompt,
    address,
    chainId: base.id.toString() as `${number}`,
  })) as any;
  if (response[0].solver !== "LI.FI") {
    const approveNedeedAction =
      response[0].action === "swap" ||
      response[0].action === "bridge" ||
      response[0].action === "deposit" ||
      response[0].action === "withdraw";
    const approveNeeded =
      approveNedeedAction &&
      response[0].data.fromToken.address !==
        "0x0000000000000000000000000000000000000000";
    return {
      description: response[0].data.description,
      to: response[0].data.steps[0].to,
      data: response[0].data.steps[0].data,
      value: response[0].data.steps[0].value,
      approveNeeded: approveNeeded,
      fromTokenAddress: response[0].data.fromToken.address,
      fromTokenAmount: response[0].data.fromAmount,
    };
  }

  const approveNedeedAction =
    response[0].action === "swap" ||
    response[0].action === "bridge" ||
    response[0].action === "deposit" ||
    response[0].action === "withdraw";
  const approveNeeded =
    approveNedeedAction &&
    response[0].data[0].fromToken.address !==
      "0x0000000000000000000000000000000000000000";

  return {
    description: response[0].data[0].description,
    to: response[0].data[0].steps![0].to,
    data: response[0].data[0].steps![0].data,
    value: response[0].data[0].steps![0].value,
    approveNeeded: approveNeeded,
    fromTokenAddress: response[0].data.fromToken.address,
    fromTokenAmount: response[0].data.fromAmount,
  };
}
