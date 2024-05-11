import { useBrian } from "@/hooks/use-brian";
import { useCreateTokenboundAccount } from "@/hooks/use-create-tokenbound-account";
import { useTokenboundAccount } from "@/hooks/use-tokenbound-account";
import { NFT, formatAddress } from "@/lib/utils";
import { Button, Image, Input, Spinner } from "@nextui-org/react";
import { useState } from "react";
import {
  useAccount,
  useBalance,
  usePublicClient,
  useReadContract,
  useWriteContract,
} from "wagmi";
import { RefreshCcwIcon, CopyIcon, CopyCheckIcon } from "lucide-react";
import { useExecuteTokenboundAccountTx } from "@/hooks/use-execute-tokenbound-account-tx";
import { erc20Abi, formatUnits } from "viem";
import { USDC_BASE_ADDRESS } from "@/lib/constants";

const initialMessages: Message[] = [
  {
    sender: "agent",
    content:
      "Hello there! I'm your based punk agent. How can I help you today?",
  },
  {
    sender: "agent",
    content:
      "Try something like 'send 1 ETH to 0x1234...' or 'swap 100 USDC for ETH'",
  },
  {
    sender: "agent",
    content:
      "Just type your request in the chat below, and I'll do my best to help you out!",
  },
];

enum MessageStatus {
  SUCCESS = "success",
  LOADING = "loading",
  ERROR = "error",
}
interface Message {
  sender: "user" | "agent";
  content: string;
  status?: MessageStatus;
}

interface BrianAction {
  description: string;
  to: string;
  data: string;
  value: string;
  approveNeeded?: boolean;
  fromTokenAddress?: string;
  fromTokenAmount?: string;
}

export const BasedPunkChat = ({ nft }: { nft?: NFT }) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [brianLoading, setBrianLoading] = useState(false);
  const [brianAction, setBrianAction] = useState<BrianAction>();
  const [isCopied, setIsCopied] = useState(false);
  const {
    data: tokenBoundAccount,
    error,
    loading,
    refetch,
  } = useTokenboundAccount({
    nft: nft!,
  });
  const { data: ethBalance, isLoading: isLoadingETHBalance } = useBalance({
    address: tokenBoundAccount?.account as `0x${string}`,
  });
  const { data: usdcBalance, isLoading: isLoadingUSDCBalance } =
    useReadContract({
      address: USDC_BASE_ADDRESS,
      abi: erc20Abi,
      functionName: "balanceOf",
      args: [tokenBoundAccount?.account as `0x${string}`],
    });
  const createTokenBoundAccount = useCreateTokenboundAccount({
    nft: nft!,
  });
  const [prompt, setPrompt] = useState("");
  const sendPromptToBrian = useBrian({
    tokenboundAccountAddress: tokenBoundAccount?.account!,
  });
  const executeTokenboundAccountTx = useExecuteTokenboundAccountTx({
    tokenBoundAccountAddress: tokenBoundAccount?.account!,
  });
  const copyAddress = () => {
    if (typeof navigator === "undefined") return;
    navigator.clipboard.writeText(tokenBoundAccount?.account!);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };
  const sendMessage = async () => {
    setBrianLoading(true);
    setPrompt("");
    if (!prompt) return;
    if (prompt.toLowerCase() === "yes") {
      setMessages([
        ...messages,
        {
          sender: "user",
          content: prompt,
        },
      ]);
      const txHash = await executeTokenboundAccountTx(
        brianAction!.to,
        brianAction!.value,
        brianAction!.data,
        brianAction!.approveNeeded
          ? {
              approveNeeded: brianAction!.approveNeeded,
              fromTokenAddress: brianAction!.fromTokenAddress,
              fromTokenAmount: brianAction!.fromTokenAmount,
            }
          : {}
      );
      setMessages([
        ...messages,
        {
          sender: "agent",
          content: `Transaction completed! Check it out on Basescan: https://basescan.org/tx/${txHash}`,
        },
      ]);
      setBrianLoading(false);
      return;
    }
    setMessages([
      ...messages,
      {
        sender: "user",
        content: prompt,
      },
      {
        sender: "agent",
        status: MessageStatus.LOADING,
        content: "loading",
      },
    ]);
    const res = await sendPromptToBrian(prompt);
    setBrianAction(res);
    setMessages([
      ...messages,
      {
        sender: "user",
        content: prompt,
      },
      {
        sender: "agent",
        content: `${res.description} Type "yes" to confirm, or ask me something else.`,
      },
    ]);
    setBrianLoading(false);
  };
  const resetConversation = async () => {
    setMessages(initialMessages);
    setBrianLoading(false);
  };
  if (!nft)
    return (
      <div className="flex flex-col gap-4 items-start bg-primary rounded-3xl p-8">
        <div className="flex flex-row items-center gap-4 bg-white/15 p-4 rounded-xl">
          <div className="text-3xl text-white animate-pulse">
            select one of your based punk to start
          </div>
        </div>
      </div>
    );

  return (
    <div className="flex flex-col gap-4 bg-primary rounded-3xl p-8 w-full">
      <div className="flex flex-row items-center gap-4 bg-slate-800/25 p-4 justify-between rounded-xl w-full">
        <div className="flex flex-row gap-4 items-center">
          <Image
            src={nft.image}
            alt="selected-nft-image"
            className="h-16 rounded-full"
          />
          <div className="flex flex-col">
            <div className="text-3xl text-white leading-none">{nft.name}</div>
            {!tokenBoundAccount?.isDeployed ? (
              <div
                className="text-white/60 cursor-pointer hover:-translate-y-1 transition-transform"
                onClick={async () => {
                  if (!tokenBoundAccount?.isDeployed) {
                    await createTokenBoundAccount();
                    await refetch!();
                  }
                }}
              >
                Deploy your based agent
              </div>
            ) : (
              <div className="flex flex-row gap-4 items-center">
                <div className="flex flex-row gap-2 items-center">
                  <div className="text-white/60">
                    {formatAddress(tokenBoundAccount.account)}
                  </div>
                  {!isCopied ? (
                    <CopyIcon
                      className="text-white/60 cursor-pointer"
                      size={12}
                      onClick={copyAddress}
                    />
                  ) : (
                    <CopyCheckIcon className="text-white/60" size={12} />
                  )}
                </div>
                <div>
                  <span className="text-white/60 font-semibold">$ETH:</span>{" "}
                  {isLoadingETHBalance ? (
                    <Spinner size="sm" color="default" />
                  ) : (
                    <span className="text-white/60">
                      {formatUnits(ethBalance!.value, 18).substring(0, 6)}
                    </span>
                  )}
                </div>
                <div>
                  <span className="text-white/60 font-semibold">$USDC:</span>{" "}
                  {isLoadingUSDCBalance ? (
                    <Spinner size="sm" color="default" />
                  ) : (
                    <span className="text-white/60">
                      {parseFloat(formatUnits(usdcBalance!, 6)).toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        <RefreshCcwIcon
          className="text-white cursor-pointer"
          onClick={resetConversation}
        />
      </div>
      {tokenBoundAccount?.isDeployed && (
        <div className="flex flex-col w-full">
          <div className="flex flex-col gap-2 justify-end bg-primary pt-16 w-full h-[300px] overflow-y-scroll my-4">
            {messages.map((message, index) => {
              if (message.sender === "agent") {
                return (
                  <div
                    key={index}
                    className="flex flex-row items-start justify-start text-left gap-4 bg-gray-700 px-4 py-2 rounded-xl max-w-[66%]"
                  >
                    {message.status === MessageStatus.LOADING ? (
                      <div className="text-white text-left">
                        I&apos;m thinking...
                      </div>
                    ) : (
                      <div className="text-white text-left">
                        {message.content}
                      </div>
                    )}
                  </div>
                );
              }
              return (
                <div
                  key={index}
                  className="ml-auto flex flex-row items-end justify-end text-right gap-4 bg-white/30 px-4 py-2 rounded-xl  max-w-[66%]"
                >
                  <div className="text-white text-right">{message.content}</div>
                </div>
              );
            })}
          </div>
          <div className="flex flex-row items-center gap-8">
            <Input
              type="text"
              placeholder="Chat here..."
              value={prompt}
              onValueChange={setPrompt}
            />
            <Button
              className="bg-white text-primary"
              onPress={() => sendMessage()}
              isDisabled={brianLoading || !prompt}
              isLoading={brianLoading}
            >
              Send
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
