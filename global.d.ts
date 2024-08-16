import { getConfig } from "./wagmi.config";

interface Window {
  ethereum?: any;
}

declare module "wagmi" {
  interface Register {
    config: ReturnType<typeof getConfig>;
  }
}
