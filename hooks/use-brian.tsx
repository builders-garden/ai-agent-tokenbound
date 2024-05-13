import { useCallback } from "react";

export const useBrian = ({
  tokenboundAccountAddress,
}: {
  tokenboundAccountAddress: string;
}) => {
  const callBrianAPI = useCallback(
    async (prompt: string) => {
      const response = await fetch("/api/brian", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          secret: process.env.NEXT_PUBLIC_SECRET!,
        },
        body: JSON.stringify({
          prompt,
          address: tokenboundAccountAddress,
        }),
      });
      return await response.json();
    },
    [tokenboundAccountAddress]
  );

  return callBrianAPI;
};
