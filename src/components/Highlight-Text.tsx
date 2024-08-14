import { useState } from "react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

interface HightlightTextProps {
  children: string;
  className?: string;
  animationTiming?: number;
  animate?: boolean;
}

export const HightlightText = ({
  children,
  className,
  animationTiming = 2000,
  animate = true,
}: HightlightTextProps) => {
  const chars = children.split("");
  const delay = animate ? animationTiming / chars.length : 0;

  return (
    <h2 className={cn("type-h2 font-mono tracking-widest", className)}>
      {chars.map((char, index) => (
        <HighlightCharacter
          key={index}
          char={char}
          animate={animate}
          delay={index * delay}
        />
      ))}
    </h2>
  );
};

interface HightlightCharacterProps {
  char: string;
  animate?: boolean;
  delay: number;
}

const HighlightCharacter = ({
  char,
  animate,
  delay,
}: HightlightCharacterProps) => {
  return (
    <motion.span
      initial={{ background: animate ? "none" : "#385E90" }}
      whileInView={{ backgroundColor: "#385E90" }}
      viewport={{ once: true }}
      transition={{ duration: 0, delay: delay / 1000 }}
      className="text-foreground"
    >
      {char}
    </motion.span>
  );
};
