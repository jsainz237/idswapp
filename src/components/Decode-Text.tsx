"use client";

import {
  forwardRef,
  memo,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import _ from "lodash";

import { cn } from "@/lib/utils";

interface Props {
  animationTime?: number;
  animateOnRender?: boolean;
  className?: string;
  children: string;
}

export const DecodeText = memo(
  forwardRef(function DecodeText(props: Props, ref) {
    const {
      animationTime = 2000,
      animateOnRender = true,
      className,
      children,
    } = props;

    if (typeof children !== "string") {
      throw new Error("<DecodeText> only accepts string children");
    }

    const [isVisible, setVisible] = useState(animateOnRender);

    useImperativeHandle(ref, () => {
      return {
        startAnimate() {
          setVisible(true);
        },
      };
    });

    if (!isVisible) return null;

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
      <div className={cn("flex whitespace-pre font-mono", className)}>
        {characters}
      </div>
    );
  }),
);

function DecodeCharacter({ char, delay }: { char: string; delay: number }) {
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
