"use client";

import { useEffect, useReducer, useState } from "react";
import _ from "lodash";

import { cn } from "@/lib/utils";

export function DecodeCharacter({ char, delay }: { char: string; delay: number }) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const timeouts = [delay, delay + 50, delay + 200].map((delay, idx) => {
      return setTimeout(() => {
        setStage(idx + 1);
      }, delay);
    });

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [delay, char]);

  const cursor = <span className="block absolute w-[1px] h-full bg-foreground left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"></span>;
  const blockCover = <span className="block absolute h-full w-[120%] bg-foreground left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"></span>;

  return (
    <span className="relative [&:not(:last-child)]:mr-1">
      {stage === 1 && cursor}
      {stage === 2 && blockCover}
      <span className={cn({ 'opacity-0': stage !== 3 })}>{char}</span>
    </span>
  )
};