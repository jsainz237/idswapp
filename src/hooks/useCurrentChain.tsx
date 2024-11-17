import { useMemo } from "react";
import { useAccount } from "wagmi";
import { useChains } from "wagmi";
import { bsc } from "wagmi/chains";

export const useCurrentChain = () => {
  const wallet = useAccount();
  const chains = useChains();

  return useMemo(
    () => chains.find(c => c.id === wallet.chainId) || bsc,
    [chains, wallet.chainId],
  );
};
