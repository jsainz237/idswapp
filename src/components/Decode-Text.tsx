"use client";

import { memo } from "react";
import _ from "lodash";

import { cn } from "@/lib/utils";

import { DecodeCharacter } from "./Decode-Character";

interface Props {
  children: string;
  size?: number;
  className?: string;
  animationTime?: number;
}

export const DecodeText = memo(function DecodeText({
  children,
  className,
  size = 14,
  animationTime = 2000,
}: Props) {
  if (typeof children !== "string") {
    throw new Error("<DecodeText> only accepts string children");
  }

  const characterMap = children.split("").map((char, idx) => ({ char, idx }));

  const revealOrder = _(characterMap)
    .filter(({ char }) => char !== " ")
    .map(({ idx }) => idx)
    .shuffle()
    .value();

  const characters = characterMap.map(({ char, idx }) => {
    if (char === " ") {
      return <span key={idx}>{char}</span>;
    }

    const characterDelay = animationTime / characterMap.length;
    const delay = (revealOrder.indexOf(idx) || 0) * characterDelay;
    return <DecodeCharacter key={idx} char={char} delay={delay} />;
  });

  return (
    <div
      className={cn("flex whitespace-pre font-mono", className)}
      style={{ fontSize: size }}
    >
      {characters}
    </div>
  );
});
