import { executeTransaction } from "@/lib/tokebound/transactions";
import { TokenboundClient } from "@tokenbound/sdk";
import { useCallback, useEffect, useState } from "react";
import {
  createPublicClient,
  encodeFunctionData,
  erc20Abi,
  getContract,
  http,
} from "viem";
import { base, mainnet } from "viem/chains";
import { useWalletClient } from "wagmi";

export const useExecuteTokenboundAccountTx = ({
  tokenBoundAccountAddress,
}: {
  tokenBoundAccountAddress: string;
}) => {
  const { data: walletClient } = useWalletClient();
  const executeTokenboundAccountTx = useCallback(
    async (
      to: string,
      value: string,
      data: string,
      approvalOptions: {
        approveNeeded?: boolean;
        fromTokenAddress?: string;
        fromTokenAmount?: string;
      }
    ) => {
      console.log({
        tokenBoundAccountAddress,
        to,
        value,
        data,
        approvalOptions,
      });
      const tokenboundClient = new TokenboundClient({
        // @ts-ignore
        walletClient,
        chainId: base.id,
      });
      const publicClient = await createPublicClient({
        chain: base,
        transport: http(),
      });
      // check account allowance from viem client
      if (approvalOptions?.approveNeeded) {
        const fromTokenAddress = approvalOptions.fromTokenAddress;
        const fromTokenAmount = approvalOptions.fromTokenAmount;

        const allowance = await publicClient.readContract({
          address: fromTokenAddress as `0x${string}`,
          functionName: "allowance",
          abi: erc20Abi,
          args: [
            tokenBoundAccountAddress as `0x${string}`,
            to as `0x${string}`,
          ],
        });
        if (allowance < BigInt(fromTokenAmount!)) {
          const encodedApprovalData = encodeFunctionData({
            abi: erc20Abi,
            functionName: "approve",
            args: [to as `0x${string}`, BigInt(fromTokenAmount!)],
          });
          const approveTx = await executeTransaction({
            tokenboundClient,
            account: tokenBoundAccountAddress,
            to: fromTokenAddress!,
            value: "",
            data: encodedApprovalData,
          });
          await publicClient.waitForTransactionReceipt({
            hash: approveTx.txHash as `0x${string}`,
          });
        }
      }
      const txHash = await executeTransaction({
        tokenboundClient,
        account: tokenBoundAccountAddress,
        to,
        value,
        data,
      });
      const rec = await publicClient.waitForTransactionReceipt({
        hash: txHash.txHash as `0x${string}`,
      });
      return txHash.txHash;
    },
    [tokenBoundAccountAddress, walletClient]
  ); // Add an empty array as the second argument

  return executeTokenboundAccountTx;
};
