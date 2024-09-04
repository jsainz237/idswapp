"use client";

import { useRef } from "react";
import { Coins, Factory, Link } from "lucide-react";

import { DecodeText } from "@/components/Decode-Text";
import { EaseIn } from "@/components/Ease-In";
import { HightlightText } from "@/components/Highlight-Text";
import { cn, isEven } from "@/lib/utils";

export function AboutSection() {
  const sections = [
    {
      icon: Factory,
      title: "Generate an IDSwapp ID",
      description: "Generate a unique IDSwapp email to represent your account",
    },
    {
      icon: Link,
      title: "Link your accounts",
      description: "Link external accounts to your IDSwapp email",
    },
    {
      icon: Coins,
      title: "Buy and sell accounts",
      description: "Trade accounts with other users",
    },
  ];

  return (
    <div className="min-screen-no-header flex flex-col items-center bg-gray-900 py-8">
      <HightlightText
        animationTiming={500}
        className="type-h2 mb-24 mt-10 font-mono"
      >
        Accounts with IDSwapp
      </HightlightText>
      <div className="container flex max-w-2xl flex-col justify-center">
        {sections.map((section, idx) => (
          <div
            key={idx}
            className={cn("mb-24 flex flex-col", {
              "items-end text-right": !isEven(idx),
            })}
          >
            <AboutStep step={idx + 1}>
              <div>
                <div
                  className={cn("flex items-end", {
                    "justify-end": !isEven(idx),
                  })}
                >
                  {isEven(idx) && <section.icon size={28} className="mr-4" />}
                  <p className="type-large">{section.title}</p>
                  {!isEven(idx) && <section.icon size={28} className="ml-4" />}
                </div>
                <p className="type-small mt-4 text-muted-foreground">
                  {section.description}
                </p>
              </div>
            </AboutStep>
          </div>
        ))}
      </div>
    </div>
  );
}

function AboutStep({
  step,
  children,
}: {
  step: number;
  children: React.ReactNode;
}) {
  const ref1 = useRef<any>();
  const ref2 = useRef<any>();

  const decodeTextProps = {
    size: 60,
    animationTime: 500,
    animateOnRender: false,
  };

  const onEnterView = () => {
    ref1.current?.startAnimate();
    ref2.current?.startAnimate();
  };

  return (
    <EaseIn
      className={cn("flex items-center", { "flex-row-reverse": isEven(step) })}
      offset={{ x: 0, y: 50 }}
      onViewportEnter={onEnterView}
    >
      <div className={cn("mr-4 -space-y-10", { "mr-0 ml-4": isEven(step) })}>
        <DecodeText ref={ref1} className="font-mono" {...decodeTextProps}>
          STEP
        </DecodeText>
        <DecodeText ref={ref2} className="font-mono" {...decodeTextProps}>
          {`0x0${step}`}
        </DecodeText>
      </div>
      {children}
    </EaseIn>
  );
}
