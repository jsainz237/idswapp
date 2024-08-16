"use client";

import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { cookieStorage, createStorage, http } from "wagmi";
import { localhost, mainnet } from "wagmi/chains";

export function getConfig() {
  return getDefaultConfig({
    appName: "IDSwapp",
    projectId: "40129e3b3d71f1eea86f311b162e4744",
    chains: [mainnet, localhost],
    storage: createStorage({
      storage: cookieStorage,
    }),
    ssr: true,
    transports: {
      [mainnet.id]: http(),
      [localhost.id]: http(),
    },
  });
}
