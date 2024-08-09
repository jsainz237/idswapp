import { Inter as FontSans, Courier_Prime } from "next/font/google";
import type { Metadata } from "next";

import { WalletProvider } from "@/components/context/wallet-context";
import { Header } from "@/components/Header";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

import "./globals.css";

const inter = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const courierPrime = Courier_Prime({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "IDSwapp",
  description: "Sell accounts via smart contracts!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "flex min-h-screen flex-col bg-background font-sans antialiased",
          inter.variable,
          courierPrime.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <WalletProvider>
            <Header />
            {children}
          </WalletProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
