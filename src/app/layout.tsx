import {
  Inter as FontSans,
  Share_Tech_Mono as FontMono,
} from "next/font/google";
import { headers } from "next/headers";
import { ThemeProviderProps } from "next-themes/dist/types";
import type { Metadata } from "next";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { WagmiProviders } from "@/components/WagmiProviders";
import { compose } from "@/lib/compose";
import { cn } from "@/lib/utils";

import "@rainbow-me/rainbowkit/styles.css";
import "./globals.css";

const inter = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const courierPrime = FontMono({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "IDSwapp",
  description: "Sell accounts via smart contracts!",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const cookie = headers().get("cookie");

  const themProviderProps: Omit<ThemeProviderProps, "children"> = {
    attribute: "class",
    defaultTheme: "dark",
    disableTransitionOnChange: true,
  };

  const Providers = compose([
    [WagmiProviders, { cookie }],
    [ThemeProvider, themProviderProps],
  ]);

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "bg-background font-sans antialiased",
          inter.variable,
          courierPrime.variable,
        )}
      >
        <Providers>
          <div className="flex h-full min-h-screen flex-col pt-[var(--header)]">
            <Header />
            <main className="flex flex-1 flex-col">{children}</main>
            <Toaster />
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
