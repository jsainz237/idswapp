import React, { Children, cloneElement, useRef, useState } from "react";

import { cn } from "@/lib/utils";

interface CardScrollContainerProps {
  children: React.ReactNode;
}

export interface ExpandableCardProps {
  isExpanded?: boolean;
  isScrolling?: boolean;
  handleCardClick?: () => void;
}

export const ExpandableCards = ({ children }: CardScrollContainerProps) => {
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  const [scrollingCardId, setScrollingCardId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleCardClick = (id: string) => {
    if (expandedCardId === id) {
      setExpandedCardId(null);
      return;
    }

    setScrollingCardId(id);
    const cardElement = document.getElementById(`card-${id}`);
    if (cardElement) {
      // Check if screen width is larger than Tailwind md breakpoint (768px)
      const isLgScreen = window.innerWidth >= 1024;

      // Only scroll horizontally on md+ screens
      cardElement.scrollIntoView({
        behavior: "smooth",
        block: isLgScreen ? "center" : "nearest",
        inline: isLgScreen ? "center" : "nearest",
      });
    }

    // Wait for scrolling to complete before expanding
    setTimeout(() => {
      setScrollingCardId(null);
      setExpandedCardId(id);
    }, 300);
  };

  return (
    <div
      ref={containerRef}
      className="flex w-full snap-x snap-mandatory gap-4 px-2 py-4 max-lg:snap-y max-lg:flex-col lg:space-x-4 lg:overflow-x-auto"
    >
      {Children.map(children, (child, idx) => {
        const key = idx.toString();
        const isExpanded = expandedCardId === key;
        const isScrolling = scrollingCardId === key;

        return (
          <div
            key={key}
            id={`card-${key}`}
            className={cn(
              "shrink-0 snap-center transition-all duration-300 ease-in-out max-lg:h-fit h-full",
              isExpanded ? "w-full max-lg:h-[300px]" : "w-[40vw] max-lg:w-full",
              isScrolling ? "scale-105" : "",
            )}
          >
            {cloneElement(child as React.ReactElement, {
              isExpanded,
              isScrolling,
              handleCardClick: () => handleCardClick(key),
            })}
          </div>
        );
      })}
    </div>
  );
};
