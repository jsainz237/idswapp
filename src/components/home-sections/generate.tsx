import { PlusCircle } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";

import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

export function GenerateSection() {
  return (
    <div className="container my-10">
      <Card className="group/card rounded-3xl bg-id-pink px-4 py-8 text-primary transition-all duration-300 has-[#generate-button:hover]:text-muted sm:px-6">
        <CardContent className="relative z-0 py-0">
          <h2 className="type-h2 border-none font-black tracking-wide">
            Generate an IDSwapp Account <br /> now to start trading :)
          </h2>

          <GenerateButton className="peer/button" />
          <div className="absolute -left-2 top-0 h-0 w-1 rounded-full bg-id-blue transition-all duration-300 peer-hover/button:h-full" />
        </CardContent>
      </Card>
    </div>
  );
}

const GenerateButton = ({ className }: { className?: string }) => {
  const buttonContentClass =
    "flex items-center text-foreground transition-all duration-300";

  return (
    <Link href="/new">
      <Button
        id="generate-button"
        className={cn(
          className,
          "group/button relative mt-16 overflow-hidden bg-background font-mono text-foreground transition-colors hover:bg-background",
        )}
        size={"lg"}
      >
        <div className="absolute -bottom-full left-1/2 mx-auto h-[200%] w-full -translate-x-1/2 scale-0 rounded-full bg-primary transition-all duration-300 group-hover/button:w-full group-hover/button:scale-150" />
        <div
          className={cn(
            buttonContentClass,
            "group-hover/button:-translate-y-10",
          )}
        >
          <PlusCircle className="mr-2 size-4" />
          Generate Account
        </div>
        <div
          className={cn(
            buttonContentClass,
            "absolute translate-y-10 text-muted group-hover/button:translate-y-0",
          )}
        >
          <PlusCircle className="mr-2 size-4" />
          Generate Account
        </div>
      </Button>
    </Link>
  );
};
