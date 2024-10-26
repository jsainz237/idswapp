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
      cardElement.scrollIntoView({ behavior: "smooth", inline: "center" });
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
      className="flex w-full snap-x snap-mandatory gap-4 space-x-4 overflow-x-auto px-2 py-4"
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
              "shrink-0 snap-center transition-all duration-300 ease-in-out",
              isExpanded ? "w-full" : "w-[40vw]",
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
