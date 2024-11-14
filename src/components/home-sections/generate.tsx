import { useRef } from "react";
import { useInView } from "framer-motion";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";

import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

export function GenerateSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { amount: "all" });

  return (
    <div className="container my-10 max-sm:my-5">
      <Card
        ref={ref}
        className={cn(
          "group/card rounded-3xl bg-id-pink px-4 py-8 text-primary transition-all duration-500 sm:px-6",
          { "text-muted": isInView },
        )}
      >
        <CardContent className="relative z-0 py-0">
          <h2 className="type-h2 border-none font-black tracking-wide max-sm:text-xl">
            Generate an IDSwapp Account <br className="max-sm:hidden" /> now to
            start trading :)
          </h2>

          <GenerateButton isInView={isInView} />
          <div
            className={cn(
              "absolute -left-2 top-0 h-0 w-1 rounded-full bg-id-blue transition-all duration-500",
              { "h-full": isInView },
            )}
          />
        </CardContent>
      </Card>
    </div>
  );
}

const GenerateButton = ({ isInView }: { isInView: boolean }) => {
  const buttonContentClass =
    "flex items-center text-foreground transition-all duration-500";

  return (
    <Link href="/accounts/create">
      <Button
        id="generate-button"
        className="relative mt-16 overflow-hidden bg-background font-mono text-foreground transition-colors hover:bg-background max-sm:mt-10"
        size={"lg"}
      >
        <div
          className={cn(
            "absolute -bottom-full left-1/2 mx-auto h-[200%] w-full -translate-x-1/2 scale-0 rounded-full bg-primary transition-all duration-500",
            { "w-full scale-150": isInView },
          )}
        />
        <div
          className={cn(buttonContentClass, { "-translate-y-10": isInView })}
        >
          <PlusCircle className="mr-2 size-4" />
          Generate Account
        </div>
        <div
          className={cn(
            buttonContentClass,
            "absolute translate-y-10 text-muted",
            { "translate-y-0": isInView },
          )}
        >
          <PlusCircle className="mr-2 size-4" />
          Generate Account
        </div>
      </Button>
    </Link>
  );
};
