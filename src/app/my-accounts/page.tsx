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
import WalletNotConnected from "@/components/WalletNotConnected";
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
      <WalletNotConnected>
        Connect your wallet to view accounts you own
      </WalletNotConnected>
    );
  }

  const userAccounts = accounts?.filter((account: IAccount) => {
    return account._owner === wallet.address;
  });

  return (
    <div className="container mt-10">
      <div className="flex flex-col items-start pt-10 max-md:items-center">
        <h2 className="type-h2 mt-10 font-mono max-sm:text-2xl">
          Your IDSwapp Accounts
        </h2>
        {userAccounts?.length === 0 && (
          <h4 className="type-h4 mt-10">No accounts found</h4>
        )}
        <div className="grid w-full grid-cols-1 gap-4 py-10 md:grid-cols-2 lg:grid-cols-3">
          {isLoading && (
            <>
              <AccountSkeleton />
              <AccountSkeleton />
              <AccountSkeleton />
            </>
          )}
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

  const accountEmail = `account+${subdomain}@idswapp.com`;

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
            title="Copy Address"
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

      <div className="group">
        <h4 className="type-h4 mt-10 font-mono">IDSwapp Email</h4>
        <div className="flex items-center">
          <p className="mr-2">{accountEmail}</p>
          <CopyButton
            variant="ghost"
            size="sm"
            text={accountEmail}
            description="Copied email to clipboard"
            title="Copy Email"
            className="opacity-0 group-hover:opacity-100"
          />
        </div>
      </div>

      <h4 className="type-h4 mt-6 font-mono">Forward Email</h4>
      <p>{forwardEmail}</p>

      <h4 className="type-h4 mt-6 font-mono">Description</h4>
      <p className={cn({ "text-muted-foreground": !account.description })}>
        {account.description || "No description for account"}
      </p>

      <h4 className="type-h4 mt-6 font-mono">Price</h4>
      <p>{formatEther(account.price)} BNB</p>

      <h4 className="type-h4 mt-6 font-mono">Purchase Status</h4>
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
