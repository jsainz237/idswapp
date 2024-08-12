"use client";

import { useEffect, useState } from "react";
import _ from "lodash";

import { cn } from "@/lib/utils";

export function DecodeCharacter({
  char,
  delay,
}: {
  char: string;
  delay: number;
}) {
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

  const cursor = (
    <span className="absolute left-1/2 top-1/2 block h-full w-px -translate-x-1/2 -translate-y-1/2 bg-foreground"></span>
  );
  const blockCover = (
    <span className="absolute left-1/2 top-1/2 block h-full w-[120%] -translate-x-1/2 -translate-y-1/2 bg-foreground"></span>
  );

  return (
    <span className="relative [&:not(:last-child)]:mr-1">
      {stage === 1 && cursor}
      {stage === 2 && blockCover}
      <span className={cn({ "opacity-0": stage !== 3 })}>{char}</span>
    </span>
  );
}
