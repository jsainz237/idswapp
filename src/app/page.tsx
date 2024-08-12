"use client";

import Image from "next/image";

import { DecodeText } from "@/components/Decode-Text";
import { HightlightText } from "@/components/Highlight-Text";
import { ScrollArrow } from "@/components/Scroll-Arrow";

export default function Home() {
  return (
    <main>
      <div className="flex min-h-screen flex-col items-center justify-between">
        <div className="mt-60 flex flex-col items-center">
          <Image src="/logo.svg" width={500} height={200} alt="IDSwapp Logo" />
          <DecodeText className="mt-8" size={26} animationTime={1500}>
            DECENTRALIZED EMAIL ACCOUNTS
          </DecodeText>
        </div>
        <div className="mb-8 flex justify-center">
          <ScrollArrow />
        </div>
      </div>

      <div className="flex min-h-screen flex-col items-center bg-gray-900 py-8">
        <HightlightText className="sticky top-[120px]" animationTiming={1000}>
          Accounts with IDSwapp
        </HightlightText>
      </div>
    </main>
  );
}
