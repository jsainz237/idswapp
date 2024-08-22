"use client";

import { formatEther } from "ethers";
import { Coins, ExternalLink, Pencil } from "lucide-react";
import Link from "next/link";
import { useAccount, useReadContract } from "wagmi";

import { IDSwappAccountAbi, IDSwappFactoryAbi } from "@/abi-gen";
import { AccountSkeleton } from "@/components/Account-Skeleton";
import { CopyButton } from "@/components/Copy-Button";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { IAccount } from "@/lib/types";
import { cn, formatAddress } from "@/lib/utils";

export default function MyAccountsPage() {
  const wallet = useAccount();

  const { data: accounts, isLoading } = useReadContract({
    abi: IDSwappFactoryAbi,
    address: process.env.NEXT_PUBLIC_FACTORY_ADDRESS as `0x${string}`,
    functionName: "getAll",
    args: [],
  });

  if (!wallet.address) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <h2 className="type-h2 text-center">Wallet not connected</h2>
        <h4 className="type-h4 mt-2 text-center">
          Connect your wallet to view accounts you own
        </h4>
      </div>
    );
  }

  const userAccounts = accounts?.filter((account: IAccount) => {
    return account._owner === wallet.address;
  });

  return (
    <div className="p-header container">
      <div className="flex flex-col items-start pt-10">
        <h2 className="type-h2 mt-10">Your IDSwapp Accounts</h2>
        <div className="grid w-full grid-cols-3 gap-4 pt-10">
          {userAccounts?.map((account: IAccount) => (
            <AccountCard
              key={account._contract}
              account={account}
              isLoading={isLoading}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

interface AccountCardProps {
  account: IAccount;
  isLoading: boolean;
}

function AccountCard({ account, isLoading }: AccountCardProps) {
  const { data: privateDetails, isLoading: detailsLoading } = useReadContract({
    abi: IDSwappAccountAbi,
    address: account._contract as `0x${string}`,
    functionName: "privateDetails",
  });

  const loading = isLoading || detailsLoading;
  const [subdomain, forwardEmail] = privateDetails || [];

  if (loading) {
    return <AccountSkeleton />;
  }

  return (
    <Card className="w-full px-6 py-4">
      <div className="flex items-center justify-between">
        <h3 className="type-h3 font-mono">{subdomain}</h3>

        <div className="flex items-center">
          <CopyButton
            variant="ghost"
            size="sm"
            text={account._contract}
            description="Copied address to clipboard"
          />

          <Link href={`/my-accounts/${account._contract}/edit`}>
            <Button size="sm" variant="ghost">
              <Pencil className="size-4" />
            </Button>
          </Link>
        </div>
      </div>

      <Link
        href={`https://bscscan.com/address/${account._contract}`}
        target="_blank"
      >
        <Button className="pl-0" size="sm" variant="link">
          ({formatAddress(account._contract)})
          <ExternalLink className="ml-2 size-4" />
        </Button>
      </Link>

      <h4 className="type-h4 mt-12 font-mono">Forward Email</h4>
      <p>{forwardEmail}</p>

      <h4 className="type-h4 mt-8 font-mono">Description</h4>
      <p className={cn({ "text-muted-foreground": !account.description })}>
        {account.description || "No description for account"}
      </p>

      <h4 className="type-h4 mt-8 font-mono">Price</h4>
      <p>{formatEther(account.price)} BNB</p>

      <h4 className="type-h4 mt-8 font-mono">Purchase Status</h4>
      <p
        className={cn("flex items-center", {
          "text-muted-foreground": !account.purchasable,
        })}
      >
        {account.purchasable ? "For Sale" : "Not for sale"}
        {account.purchasable && <Coins className="ml-2 size-4" />}
      </p>
    </Card>
  );
}
