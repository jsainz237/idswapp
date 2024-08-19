"use client";

import { formatEther } from "ethers";
import { Coins, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useReadContract } from "wagmi";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ContractData } from "@/lib/types";
import { cn, formatAddress } from "@/lib/utils";

import IDSwappAccount from "../../../../artifacts/contracts/idswapp-account.sol/IDSwappAccount.json";

export default function ContractPage({
  params,
}: {
  params: { address: string };
}) {
  const contractAddress = params.address;
  const contractParams = {
    abi: IDSwappAccount.abi,
    address: contractAddress as `0x${string}`,
  };

  const { data: description, isLoading: descriptionLoading } = useReadContract({
    ...contractParams,
    functionName: "description",
  }) as ContractData<string>;

  const { data: owner, isLoading: ownerLoading } = useReadContract({
    ...contractParams,
    functionName: "owner",
  }) as ContractData<string>;

  const { data: price, isLoading: priceLoading } = useReadContract({
    ...contractParams,
    functionName: "price",
  }) as ContractData<bigint>;

  const { data: purchasable, isLoading: purchasableLoading } = useReadContract({
    ...contractParams,
    functionName: "purchasable",
  }) as ContractData<boolean>;

  const isLoading =
    descriptionLoading || ownerLoading || priceLoading || purchasableLoading;

  const getBscHref = (address: string) =>
    `https://bscscan.com/address/${address}`;

  return (
    <div className="p-header">
      <div className="container mt-10 flex max-w-3xl items-start justify-start gap-4">
        <Card className="flex flex-1 flex-col place-items-start p-8">
          <h1 className="type-h2 font-mono">IDSwapp Account</h1>

          <h4 className="type-h4 mt-12 font-mono">Description</h4>
          {isLoading ? (
            <div className="mt-2 space-y-2">
              <Skeleton className="h-4 w-[300px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          ) : (
            <p
              className={cn("mt-2", { "text-muted-foreground": !description })}
            >
              {description || "No description for account"}
            </p>
          )}

          <h4 className="type-h4 mt-12 font-mono">Price</h4>
          {isLoading ? (
            <Skeleton className="mt-2 h-4 w-[200px]" />
          ) : (
            <p className={cn("mt-2", { "text-muted-foreground": !price })}>
              {price ? `${formatEther(price)} BNB` : "N/A"}
            </p>
          )}
        </Card>
        <div>
          <Card className="p-8">
            <div className="items-center">
              <h4 className="type-h4 text-nowrap font-mono">
                Contract Address:
              </h4>
              {isLoading ? (
                <Skeleton className="mt-4 h-4 w-[100px]" />
              ) : (
                <Link href={getBscHref(contractAddress)} target="_blank">
                  <Button className="pl-0" variant="link">
                    {formatAddress(contractAddress)}
                    <ExternalLink className="ml-2 size-4" />
                  </Button>
                </Link>
              )}
            </div>

            <div className="mt-8 items-center">
              <h4 className="type-h4 text-nowrap font-mono">Current Owner:</h4>
              {isLoading ? (
                <Skeleton className="mt-4 h-4 w-[100px]" />
              ) : (
                <Link href={getBscHref(owner as string)} target="_blank">
                  <Button className="pl-0" variant="link">
                    {formatAddress(owner)}
                    <ExternalLink className="ml-2 size-4" />
                  </Button>
                </Link>
              )}
            </div>
          </Card>
          <Button disabled={!purchasable} size="lg" className="mt-4 w-full">
            {purchasable && <Coins className="mr-2 size-4" />}
            {purchasable ? "Purchase" : "Not for sale"}
          </Button>
        </div>
      </div>
    </div>
  );
}
