"use client";

import { type ReactNode, useState } from "react";
import { darkTheme, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cookieToInitialState, WagmiProvider } from "wagmi";

import { compose } from "@/lib/compose";

import { getConfig } from "../../wagmi.config";

interface Props {
  children: ReactNode;
  cookie?: string | null;
}

export function WagmiProviders({ children, cookie }: Props) {
  const initialState = cookieToInitialState(getConfig(), cookie);
  const [config] = useState(() => getConfig());
  const [queryClient] = useState(() => new QueryClient());

  const rainbowkitTheme = darkTheme({
    accentColor: "#7B94EB",
    accentColorForeground: "white",
    borderRadius: "medium",
  });

  const Providers = compose([
    [WagmiProvider, { config, initialState }],
    [QueryClientProvider, { client: queryClient }],
    [RainbowKitProvider, { theme: rainbowkitTheme }],
  ]);

  return <Providers>{children}</Providers>;
}
