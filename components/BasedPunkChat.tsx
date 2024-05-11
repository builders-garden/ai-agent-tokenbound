import { useCreateTokenboundAccount } from "@/hooks/use-create-tokenbound-account";
import { useTokenboundAccount } from "@/hooks/use-tokenbound-account";
import { NFT } from "@/lib/nft-utils";
import { Button, Image, Input } from "@nextui-org/react";
import { base } from "viem/chains";
import { useAccount } from "wagmi";

export const BasedPunkChat = ({ nft }: { nft?: NFT }) => {
  const { address } = useAccount();
  const {
    data: tokenBoundAccount,
    error,
    loading,
    refetch,
  } = useTokenboundAccount({
    nft: nft!,
  });
  const createTokenBoundAccount = useCreateTokenboundAccount({
    nft: nft!,
  });
  if (!nft)
    return (
      <div className="flex flex-col gap-4 items-start bg-primary rounded-3xl p-8">
        <div className="flex flex-row items-center gap-4 bg-white/15 p-4 rounded-xl">
          <div className="text-3xl text-white">
            select one of your based punk to start
          </div>
        </div>
      </div>
    );

  return (
    <div className="flex flex-col gap-4 items-start bg-primary rounded-3xl p-8 w-full">
      <div
        className="flex flex-row items-center gap-4 bg-white/30 p-4 rounded-xl w-full cursor-pointer hover:-translate-y-1 transition-transform"
        onClick={async () => {
          if (!tokenBoundAccount?.isDeployed) {
            await createTokenBoundAccount();
            await refetch!();
          }
        }}
      >
        <Image
          src={nft.image}
          alt="selected-nft-image"
          className="h-16 rounded-full"
        />
        <div className="flex flex-col">
          <div className="text-3xl text-white leading-none">{nft.name}</div>
          {!tokenBoundAccount?.isDeployed && (
            <div className="text-amber-300">Deploy your based agent</div>
          )}
        </div>
      </div>
      {tokenBoundAccount?.isDeployed && (
        <div className="flex flex-col justify-between">
          <div className="flex flex-col gap-4 items-start bg-primary/50 rounded-3xl p-8">
            Hello there! I&apos;m your based punk agent. How can I help you
            today?
          </div>
          <div className="flex flex-row items-center gap-8">
            <Input type="text" label="Chat here" />
            <Button className="bg-white text-primary h-full">Send</Button>
          </div>
        </div>
      )}
    </div>
  );
};
