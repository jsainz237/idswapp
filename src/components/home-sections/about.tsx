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
    <div className="min-screen-no-header flex flex-col items-center bg-gray-900 px-4 py-8 sm:px-6">
      <HightlightText
        animationTiming={500}
        className="type-h2 mb-12 mt-6 text-center font-mono max-sm:text-2xl sm:mb-24 sm:mt-10"
      >
        Accounts with IDSwapp
      </HightlightText>
      <div className="container flex max-w-2xl flex-col justify-center">
        {sections.map((section, idx) => (
          <div
            key={idx}
            className={cn("mb-12 sm:mb-24 flex flex-col", {
              "items-center sm:items-end text-center sm:text-right":
                !isEven(idx),
              "items-center sm:items-start text-center sm:text-left":
                isEven(idx),
            })}
          >
            <AboutStep step={idx + 1}>
              <div>
                <div
                  className={cn("flex items-center sm:items-end", {
                    "justify-center sm:justify-end": !isEven(idx),
                    "justify-center sm:justify-start": isEven(idx),
                  })}
                >
                  {isEven(idx) && (
                    <section.icon className="mr-4 size-5 sm:size-7" />
                  )}
                  <p className="type-large">{section.title}</p>
                  {!isEven(idx) && (
                    <section.icon className="ml-4 size-5 sm:size-7" />
                  )}
                </div>
                <p className="type-small mt-4 max-w-sm text-muted-foreground">
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
      className={cn("flex flex-col sm:flex-row items-center gap-2", {
        "sm:flex-row-reverse": isEven(step),
      })}
      offset={{ x: 0, y: 50 }}
      onViewportEnter={onEnterView}
    >
      <div
        className={cn("text-center sm:text-left sm:mr-4", {
          "sm:mr-0 sm:ml-4": isEven(step),
        })}
      >
        <DecodeText
          ref={ref1}
          className="mb-2 font-mono text-4xl max-sm:hidden sm:text-[60px]"
          {...decodeTextProps}
        >
          STEP
        </DecodeText>
        <DecodeText
          ref={ref2}
          className="font-mono text-4xl sm:text-[60px]"
          {...decodeTextProps}
        >
          {`0x0${step}`}
        </DecodeText>
      </div>
      {children}
    </EaseIn>
  );
}
