"use client";

import { useState } from "react";
import { formatEther } from "ethers";
import { Coins, ExternalLink } from "lucide-react";
import { useReadContract } from "wagmi";

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
import { formatAddress, formatPrice } from "@/lib/utils";

import IDSwappFactory from "../../../artifacts/contracts/idswapp-factory.sol/IDSwappFactory.json";

interface IAccount {
  _owner: string;
  _contract: string;
  description: string;
  price: number;
  purchasable: boolean;
}

export default function AccountsPage() {
  const { data: accounts } = useReadContract({
    abi: IDSwappFactory.abi,
    address: process.env.NEXT_PUBLIC_FACTORY_ADDRESS as `0x${string}`,
    functionName: "getAll",
    args: [],
  });

  return (
    <div className="p-header container">
      <div className="mt-20 flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="type-h2 font-mono">IDSwapp Accounts</h1>
        </div>

        <div className="flex items-center space-x-4">
          <Toggle variant="outline" aria-label="Only purchasable accounts">
            <Coins className="size-4" />
          </Toggle>
          <Input
            className="w-40 after:content-['wei']"
            type="number"
            placeholder="Max price (ETH)"
            step="0.0001"
            min={0.0}
          />
          <Input className="w-80" type="search" placeholder="Search" />
        </div>
      </div>

      <Table className="mt-8">
        <TableHeader>
          <TableRow>
            <TableHead>Address</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {accounts?.map((account: IAccount) => (
            <TableRow key={account._contract}>
              <TableCell className="font-medium" title={account._contract}>
                <span className="flex items-center">
                  {formatAddress(account._contract)}
                  <ExternalLink className="ml-2 size-4" />
                </span>
              </TableCell>
              <TableCell className="font-medium">
                <span className="flex items-center">
                  {formatAddress(account._owner)}
                  <ExternalLink className="ml-2 size-4" />
                </span>
              </TableCell>
              <TableCell>{account.description}</TableCell>
              <TableCell>
                {account.purchasable ? (
                  <span className="flex items-center">
                    <Coins className="mr-2 size-4" />
                    {formatPrice(account.price)} ETH
                  </span>
                ) : (
                  <span className="text-muted-foreground">Not for sale</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
