"use client";

import { useState } from "react";
import { formatEther } from "ethers";
import { Coins, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useAccount, useReadContract, useWriteContract } from "wagmi";

import { CopyButton } from "@/components/Copy-Button";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { ContractData } from "@/lib/types";
import { cn, formatAddress, formatPrice } from "@/lib/utils";

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

  const { toast } = useToast();
  const { address: walletAddress } = useAccount();
  const { writeContract, error: writeError } = useWriteContract();
  const [dialogOpen, setDialogOpen] = useState(false);

  const {
    data: publicData,
    error,
    isLoading,
    refetch,
  } = useReadContract({
    ...contractParams,
    functionName: "publicDetails",
  }) as ContractData<[string, string, string, bigint, boolean]>;

  if (error || writeError) {
    console.error(error || writeError);
    return null;
  }

  const [_contract, owner, description, price, purchasable] = publicData || [];

  if (isLoading) return <ContractPageSkeleton />;

  const purchaseDisabled = !purchasable || owner === walletAddress;
  const ctaText = () => {
    if (owner === walletAddress) return "Owned by you";
    if (purchasable) return "Purchase";
    return "Not for sale";
  };

  const purchaseAccount = (email: string) => {
    writeContract(
      {
        ...contractParams,
        functionName: "purchaseAccount",
        args: [email],
        value: price,
      },
      {
        onSuccess: (...params) => {
          console.log(params);
          refetch();
          toast({ description: "Account purchased successfully" });
        },
        onError: err => {
          console.error(err);
          toast({
            title: "Error",
            description: err.message,
            variant: "destructive",
          });
        },
      },
    );
  };

  const getBscHref = (address: string) =>
    `https://bscscan.com/address/${address}`;

  return (
    <div className="p-header">
      <div className="container mt-10 flex max-w-3xl items-start justify-start gap-4">
        <Card className="flex flex-1 flex-col place-items-start p-8">
          <h1 className="type-h2 font-mono">IDSwapp Account</h1>

          <h4 className="type-h4 mt-12 font-mono">Description</h4>
          <p className={cn("mt-2", { "text-muted-foreground": !description })}>
            {description || "No description for account"}
          </p>

          <h4 className="type-h4 mt-12 font-mono">Price</h4>
          <p className={cn("mt-2", { "text-muted-foreground": !price })}>
            {price ? `${formatEther(price)} BNB` : "N/A"}
          </p>
        </Card>
        <div>
          <Card className="p-8">
            <div className="items-center">
              <h4 className="type-h4 text-nowrap font-mono">
                Contract Address:
              </h4>

              <div className="flex items-center space-x-1">
                <CopyButton
                  variant="ghost"
                  size="sm"
                  text={contractAddress}
                  className="mr-2"
                  description="Copied address to clipboard"
                />
                <Link href={getBscHref(contractAddress)} target="_blank">
                  <Button className="pl-0" variant="link">
                    {formatAddress(contractAddress)}
                    <ExternalLink className="ml-2 size-4" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="mt-8 items-center">
              <h4 className="type-h4 text-nowrap font-mono">Current Owner:</h4>

              <div className="flex items-center space-x-1">
                <CopyButton
                  variant="ghost"
                  size="sm"
                  text={contractAddress}
                  className="mr-2"
                  description="Copied address to clipboard"
                />
                <Link href={getBscHref(owner as string)} target="_blank">
                  <Button className="pl-0" variant="link">
                    {formatAddress(owner)}
                    <ExternalLink className="ml-2 size-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
          <PurchaseDialog
            open={dialogOpen}
            setOpen={setDialogOpen}
            price={price}
            onConfirm={purchaseAccount}
          >
            <Button
              disabled={purchaseDisabled}
              size="lg"
              className="mt-4 w-full"
            >
              {!purchaseDisabled && <Coins className="mr-2 size-4" />}
              {ctaText()}
            </Button>
          </PurchaseDialog>
        </div>
      </div>
    </div>
  );
}

interface PurchaseDialogProps {
  price: bigint;
  open: boolean;
  setOpen: (open: boolean) => void;
  onConfirm?: (email: string) => void | Promise<void>;
  children: React.ReactNode;
}

const PurchaseDialog = ({
  open,
  setOpen,
  onConfirm,
  price,
  children,
}: PurchaseDialogProps) => {
  const [email, setEmail] = useState("");

  const onPurchaseClick = async () => {
    await onConfirm?.(email);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Purchase Account</DialogTitle>
          <DialogDescription>
            Set a forwarding email address on the account being purchased.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>
        <DialogFooter>
          <div className="flex w-full items-center justify-between">
            <p className="font-mono">{formatPrice(price)} BNB</p>
            <Button disabled={!email} onClick={onPurchaseClick}>
              Purchase
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const ContractPageSkeleton = () => (
  <div className="p-header">
    <div className="container mt-10 flex max-w-3xl items-start justify-start gap-4">
      <Card className="flex flex-1 flex-col place-items-start p-8">
        <Skeleton className="h-8 w-[200px]" />

        <Skeleton className="mt-12 h-6 w-[300px]" />
        <div className="mt-2 space-y-2">
          <Skeleton className="h-4 w-[300px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>

        <Skeleton className="mt-12 h-6 w-[100px]" />
        <Skeleton className="mt-2 h-4 w-[200px]" />
      </Card>
      <div>
        <Card className="p-8">
          <div className="items-center">
            <Skeleton className="h-6 w-[200px] text-nowrap" />
            <Skeleton className="mt-4 h-4 w-[100px]" />
          </div>

          <div className="mt-8 items-center">
            <Skeleton className="h-6 w-[200px] text-nowrap" />
            <Skeleton className="mt-4 h-4 w-[100px]" />
          </div>
        </Card>
        <Button disabled size="lg" className="mt-4 w-full">
          Loading...
        </Button>
      </div>
    </div>
  </div>
);
