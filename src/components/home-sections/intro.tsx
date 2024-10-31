"use client";

import Image from "next/image";

import { DecodeText } from "@/components/Decode-Text";
import { ScrollArrow } from "@/components/Scroll-Arrow";

export function IntroSection() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-between">
      <div className="mt-60 flex flex-col items-center">
        <Image
          src="/logo.svg"
          width={500}
          height={200}
          alt="IDSwapp Logo"
          className="w-[280px] sm:w-[350px] md:w-[500px]"
        />
        <DecodeText
          className="mt-8 text-sm sm:text-[18px] md:text-[26px]"
          animationTime={1500}
        >
          DECENTRALIZED ACCOUNT TRADING
        </DecodeText>
      </div>

      <div className="mb-10">
        <ScrollArrow />
      </div>
    </div>
  );
}
