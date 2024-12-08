"use client";

import { useMemo, useState } from "react";
import { Coins, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useReadContract } from "wagmi";

import { IDSwappFactoryAbi } from "@/abi-gen";
import { CopyButton } from "@/components/Copy-Button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Toggle } from "@/components/ui/toggle";
import { useCurrentChain } from "@/hooks/useCurrentChain";
import { IAccount } from "@/lib/types";
import { formatAddress, formatPrice } from "@/lib/utils";

export default function AccountsPage() {
  const router = useRouter();
  const [maxPrice, setMaxPrice] = useState<number | undefined>();
  const [search, setSearch] = useState<string | undefined>();
  const [purchasable, setPurchasable] = useState<boolean>(false);

  const { chain, factoryAddress } = useCurrentChain();
  const { data: accounts } = useReadContract({
    chainId: chain.id as any,
    abi: IDSwappFactoryAbi,
    address: factoryAddress,
    functionName: "getAll",
    args: [],
  });

  const displayPrice = (price: bigint) => {
    if (price === 0n) {
      return "Free";
    }

    return `${formatPrice(price)} BNB`;
  };

  const displayDescription = (description: string) => {
    if (!description) return "-";

    if (description.length > 60) {
      return `${description.slice(0, 60)}...`;
    }

    return description;
  };

  const renderAddressLink = (address: IAccount["_contract"]) => (
    <div className="flex items-center">
      <CopyButton
        variant="ghost"
        size="sm"
        text={address}
        description="Copied address to clipboard"
      />
      <Link href={`https://bscscan.com/address/${address}`} target="_blank">
        <Button variant="link" className="flex min-w-[140px] items-center pl-0">
          {formatAddress(address)}
          <ExternalLink className="ml-2 size-4" />
        </Button>
      </Link>
    </div>
  );

  const renderPrice = (account: IAccount) => {
    if (!account.purchasable) {
      return <span className="text-muted-foreground">Not for sale</span>;
    }

    return (
      <span className="flex items-center">
        <Coins className="mr-2 size-4" />
        {displayPrice(account.price)}
      </span>
    );
  };

  const filteredAccounts = useMemo(() => {
    return (accounts as IAccount[])?.filter((account: IAccount) => {
      if (purchasable && !account.purchasable) {
        return false;
      }

      if (maxPrice && account.price > maxPrice * 1e18) {
        return false;
      }

      if (
        search &&
        !account._contract.includes(search) &&
        !account._owner.includes(search) &&
        !account.description.includes(search)
      ) {
        return false;
      }

      return true;
    });
  }, [accounts, maxPrice, purchasable, search]);

  return (
    <div className="container">
      <div className="mt-10 flex flex-col gap-4 sm:mt-20 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center">
          <h1 className="type-h2 font-mono">IDSwapp Accounts</h1>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:space-x-4">
          <Toggle
            variant="outline"
            aria-label="Only purchasable accounts"
            onClick={() => setPurchasable(!purchasable)}
          >
            <Coins className="size-4" />
          </Toggle>
          <Input
            className="w-40 after:content-['wei'] max-sm:flex-1"
            type="number"
            placeholder="Max price (BNB)"
            step="0.01"
            min={0.0}
            value={maxPrice}
            onChange={e => setMaxPrice(parseFloat(e.target.value))}
          />
          <Input
            className="max-sm:w-full sm:flex-1 lg:w-80"
            type="search"
            placeholder="Search"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-8 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[140px] max-md:hidden">
                Address
              </TableHead>
              <TableHead className="min-w-[140px] max-md:hidden">
                Owner
              </TableHead>
              <TableHead className="min-w-[200px]">Description</TableHead>
              <TableHead className="min-w-[100px]">Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAccounts?.map((account: IAccount) => (
              <TableRow
                key={account._contract}
                className="cursor-pointer"
                onClick={() => router.push(`/accounts/${account._contract}`)}
              >
                <TableCell
                  className="font-medium max-md:hidden"
                  title={account._contract}
                >
                  {renderAddressLink(account._contract)}
                </TableCell>
                <TableCell className="font-medium max-md:hidden">
                  {renderAddressLink(account._owner)}
                </TableCell>
                <TableCell title={account.description}>
                  {displayDescription(account.description)}
                </TableCell>
                <TableCell>{renderPrice(account)}</TableCell>
              </TableRow>
            ))}
            {(!filteredAccounts || filteredAccounts.length === 0) && (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No accounts on{" "}
                  <span className="font-bold">{chain?.name}</span>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
