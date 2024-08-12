import { useState } from "react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

interface HightlightTextProps {
  children: string;
  className?: string;
  animationTiming?: number;
}

export const HightlightText = ({
  children,
  className,
  animationTiming = 2000,
}: HightlightTextProps) => {
  const chars = children.split("");
  const delay = animationTiming / chars.length;

  return (
    <h2 className={cn("type-h2 font-mono tracking-widest", className)}>
      {chars.map((char, index) => (
        <HighlightCharacter key={index} char={char} delay={index * delay} />
      ))}
    </h2>
  );
};

interface HightlightCharacterProps {
  char: string;
  delay: number;
}

const HighlightCharacter = ({ char, delay }: HightlightCharacterProps) => {
  return (
    <motion.span
      initial={{ background: "none" }}
      whileInView={{ backgroundColor: "#385E90" }}
      viewport={{ once: true }}
      transition={{ duration: 0, delay: delay / 1000 }}
      className="text-foreground"
    >
      {char}
    </motion.span>
  );
};
