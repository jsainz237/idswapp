"use client";

import { useEffect, useState } from "react";
import _ from "lodash";
import Image from "next/image";

import { useWallet } from "@/components/context/wallet-context";
import { DecodeText } from "@/components/Decode-Text";
import { HightlightText } from "@/components/Highlight-Text";

export default function Home() {
  const [wallet] = useWallet();
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    // Need a debounce to prevent the warning from showing on page load
    if (!wallet.provider || !wallet.signer) {
      _.debounce(() => setShowWarning(true), 2000)();
    }

    if (wallet.provider && wallet.signer) {
      setShowWarning(false);
    }
  }, [wallet]);

  return (
    <main>
      <div className="flex min-h-screen flex-col items-center justify-between">
        <div className="mt-60 flex flex-col items-center">
          <Image src="/logo.svg" width={500} height={200} alt="IDSwapp Logo" />
          <DecodeText className="mt-8" size={26} animationTime={1500}>
            DECENTRALIZED EMAIL ACCOUNTS
          </DecodeText>
        </div>
        {showWarning && (
          <div className="type-h2 mb-10 font-mono text-lg lowercase">
            Connect wallet to get started
          </div>
        )}
      </div>
    </main>
  );
}
