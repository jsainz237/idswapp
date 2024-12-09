import { useAccount } from "wagmi";
import { useChains } from "wagmi";
import { bsc, Chain } from "wagmi/chains";

export const useCurrentChain = (): {
  chain: Chain;
  factoryAddress: `0x${string}`;
  accountAddress: `0x${string}`;
  etherScanUrl: string | undefined;
} => {
  const wallet = useAccount();
  const chains = useChains();

  const chain = chains.find(c => c.id === wallet.chainId) || bsc;

  const factoryAddress = {
    56: process.env.NEXT_PUBLIC_FACTORY_ADDRESS_56!,
    97: process.env.NEXT_PUBLIC_FACTORY_ADDRESS_97!,
    1337: process.env.NEXT_PUBLIC_FACTORY_ADDRESS_1337!,
  }[chain.id];

  const accountAddress = {
    56: process.env.NEXT_PUBLIC_ACCOUNT_ADDRESS_56!,
    97: process.env.NEXT_PUBLIC_ACCOUNT_ADDRESS_97!,
    1337: process.env.NEXT_PUBLIC_ACCOUNT_ADDRESS_1337!,
  }[chain.id];

  const etherScanUrl = {
    56: process.env.NEXT_PUBLIC_ETHERSCAN_BASE_URL_56!,
    97: process.env.NEXT_PUBLIC_ETHERSCAN_BASE_URL_97!,
    1337: process.env.NEXT_PUBLIC_ETHERSCAN_BASE_URL_1337!,
  }[chain.id];

  return {
    chain,
    factoryAddress: factoryAddress as `0x${string}`,
    accountAddress: accountAddress as `0x${string}`,
    etherScanUrl,
  };
};
