import { useEffect, useMemo, useState } from "react";
import { Book, BookOpenText, Code, ExternalLink } from "lucide-react";

import config from "@/../config";
import { useCurrentChain } from "@/hooks/useCurrentChain";
import { cn, formatAddress } from "@/lib/utils";

import { ExpandableCardProps, ExpandableCards } from "../Expandable-Cards";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Skeleton } from "../ui/skeleton";

const getResources = (chainId: number) => [
  {
    title: "How it works",
    shortDescription:
      "Generate an IDSwapp ID. Link external accounts. Sell you accounts via smart contract",
    longDescription:
      "When you create an account, an IDSwapp Account smart contract is automatically generated and owned by you. You can link an external account/email address to your IDSwapp ID, set your price, and sell your IDSwapp ID via smart contract.",
    address: "",
  },
  {
    title: "IDSwapp Factory",
    shortDescription:
      "The smart contract responsible for generating IDSwapp Accounts and their associated smart contracts",
    longDescription:
      "This smart contract is responsible for generating IDSwapp IDs & their associated smart contracts. When an ID is generated, the factory deploys a new smart contract and whitelists it's address. Only IDSwapp Factory Admins and the ID contracts can interact with the factory",
    address: config.FACTORY_ADDRESS[chainId],
  },
  {
    title: "IDSwapp Account",
    shortDescription:
      "A smart contract for managing a subdomain account with ownership, email forwarding, and trading capabilities.",
    longDescription:
      "This smart contract is responsible for managing a subdomain account with ownership, email forwarding, and trading capabilities. It is owned and whitelisted by the IDSwapp Factory and can only be interacted with by the IDSwapp Factory or the owner of the account.",
    address: config.FACTORY_ADDRESS[chainId],
  },
];

export function ResourcesSection() {
  const chain = useCurrentChain();
  const resources = useMemo(() => getResources(chain.id), [chain.id]);

  return (
    <div className="container flex w-full flex-col items-center py-10">
      <h2 className="type-h2 mb-8 font-mono">Resources</h2>
      <div className="flex w-full gap-4 lg:overflow-x-auto">
        <ExpandableCards>
          {resources.map((resource, idx) => (
            <ResourceCard key={idx} {...resource} />
          ))}
        </ExpandableCards>
      </div>
    </div>
  );
}

interface ResourceCardProps extends ExpandableCardProps {
  title: string;
  shortDescription: string;
  longDescription: string;
  address: string;
}

const ResourceCard = ({
  title,
  shortDescription,
  longDescription,
  address,
  isExpanded,
  isScrolling,
  handleCardClick,
}: ResourceCardProps) => {
  const [isAnimating, setIsAnimating] = useState(false);

  // Anytime the card is expanded or collapsed, set that the card is animating
  useEffect(() => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 600);
  }, [isExpanded, isScrolling]);

  const description = isExpanded ? longDescription : shortDescription;

  const BookIcon = isExpanded ? Book : BookOpenText;

  const renderSkeleton = () => (
    <>
      <Skeleton className="mt-2 h-4 w-1/2" />
      <Skeleton className="mt-2 h-4 w-1/3" />
    </>
  );

  return (
    <Card className="flex min-h-full flex-col justify-between">
      <div>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className={cn({ "text-muted-foreground": !isExpanded })}>
          {isAnimating ? renderSkeleton() : description}
        </CardContent>
      </div>
      <CardFooter>
        <div className="flex w-full items-center justify-between">
          <Button
            onClick={handleCardClick}
            size="sm"
            variant="ghost"
            title={isExpanded ? "Minimize" : "Read more..."}
          >
            <BookIcon className="size-4" />
          </Button>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              className="group relative mr-2 w-12 justify-start rounded-full transition-[width] duration-200 ease-in-out hover:w-[140px]"
            >
              <div className="absolute right-[12px] top-[6px] flex items-center gap-2">
                <div className="hidden opacity-0 transition-opacity duration-200 group-hover:block group-hover:opacity-100">
                  view source
                </div>
                <Code />
              </div>
            </Button>
            <Button size="sm" className="rounded-full">
              <span className="flex items-center gap-2">
                {formatAddress(address)}
                <ExternalLink className="size-4" />
              </span>
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};
