"use client";

import { useEffect, useReducer, useState } from "react";
import _ from "lodash";

import { DecodeCharacter } from './Decode-Character';
import { cn } from "@/lib/utils";

interface Props {
  children: string;
  size?: number;
  className?: string;
}

export function DecodeText({ children, className, size = 14 }: Props) {
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
      return <span key={idx}>{char}</span>
    }

    const randomDelay = _.random(30, 60);
    const delay = (revealOrder.indexOf(idx) || 0) * randomDelay;
    return <DecodeCharacter key={idx} char={char} delay={delay} />;
  });

  return <div className={cn("flex whitespace-pre font-mono", className)} style={{ fontSize: size }}>{characters}</div>;
}


