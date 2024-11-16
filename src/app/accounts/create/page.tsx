"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { BadgeCheck, ExternalLink, LoaderPinwheel } from "lucide-react";
import Link from "next/link";
import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWatchContractEvent,
  useWriteContract,
} from "wagmi";

import { IDSwappFactoryAbi } from "@/abi-gen";
import { ConfirmationDrawer } from "@/components/Confirmation-Drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import WalletNotConnected from "@/components/WalletNotConnected";
import { useBreakpoints } from "@/hooks/useBreakpoints";
import { formatAddress, isEmail } from "@/lib/utils";

export default function CreatePage() {
  const [acctAddress, setAcctAddress] = useState<`0x${string}` | null>(null);
  const [email, setEmail] = useState<string>("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { toast } = useToast();
  const { max } = useBreakpoints();

  const wallet = useAccount();
  const {
    data: hash,
    isPending,
    error: writeError,
    writeContract,
  } = useWriteContract();
  const { isSuccess, error: waitError } = useWaitForTransactionReceipt({
    hash,
  });

  const {
    data: subdomain,
    isLoading: isLoadingSubdomain,
    refetch: refetchRead,
  } = useReadContract({
    abi: IDSwappFactoryAbi,
    address: process.env.NEXT_PUBLIC_FACTORY_ADDRESS as `0x${string}`,
    functionName: "subdomainCounter",
  });

  useWatchContractEvent({
    abi: IDSwappFactoryAbi,
    address: process.env.NEXT_PUBLIC_FACTORY_ADDRESS as `0x${string}`,
    eventName: "IDSwappAccountCreated",
    onLogs: ([{ args }]) => setAcctAddress(args?.account ?? null),
  });

  const isValidEmail = useMemo(() => {
    return isEmail(email);
  }, [email]);

  const isLoading = isLoadingSubdomain || isPending;
  const error = waitError || writeError;

  const reset = () => {
    setAcctAddress(null);
    setEmail("");
    refetchRead();
  };

  const generateAccount = () => {
    writeContract({
      abi: IDSwappFactoryAbi,
      address: process.env.NEXT_PUBLIC_FACTORY_ADDRESS as `0x${string}`,
      functionName: "createAccount",
      args: [email],
    });
  };

  if (!wallet.address) {
    return (
      <WalletNotConnected>
        Connect your wallet to generate an account
      </WalletNotConnected>
    );
  }

  if (isSuccess && acctAddress) {
    return <SuccessDisplay address={acctAddress} onReset={reset} />;
  }

  if (isLoading) {
    return (
      <div className="container flex flex-1 flex-col items-center justify-center">
        <LoaderPinwheel className="size-10 animate-spin-slow" />
      </div>
    );
  }

  if (error) {
    console.log(error);
    toast({
      title: "Error",
      description: "An error occurred while generating an account.",
      variant: "destructive",
    });
  }

  return (
    <div className="container flex flex-1 flex-col items-center justify-center">
      <h4 className="type-h4 mb-4 border-b-2 font-bold max-sm:text-base">
        Generate IDSwapp Account
      </h4>
      <Input
        className="max-w-xs text-center"
        placeholder="Enter Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        type="email"
      />
      <ConfirmationDrawer
        open={drawerOpen}
        setOpen={setDrawerOpen}
        onConfirm={generateAccount}
        text={{
          title: "Gas Fee Warning",
          description: "Creating an account will require a gas fee to be paid.",
          confirmText: "Confirm and create",
          cancelText: "Cancel",
        }}
      >
        <Button
          size={max("md") ? "sm" : "default"}
          className="mt-4"
          disabled={!isValidEmail}
        >
          Generate #{subdomain}
        </Button>
      </ConfirmationDrawer>
    </div>
  );
}

const SuccessDisplay = ({
  address,
  onReset,
}: {
  address: `0x${string}`;
  onReset: () => void;
}) => {
  return (
    <div className="container flex flex-1 flex-col items-center justify-center">
      <motion.div
        initial={{ rotate: 0, scale: 0 }}
        animate={{ rotate: 360, scale: 1 }}
        transition={{ type: "spring", stiffness: 80, damping: 10 }}
      >
        <BadgeCheck className="size-14" />
      </motion.div>
      <Link className="w-full max-w-sm" href={`/accounts/${address}`}>
        <Button className="group relative mt-8 w-full overflow-hidden">
          <span className="absolute flex translate-y-0 items-center transition-all group-hover:-translate-y-10">
            View Account
            <ExternalLink className="ml-2 size-4" />
          </span>
          <div className="absolute flex translate-y-10 items-center transition-all group-hover:translate-y-0">
            {formatAddress(address)}
            <ExternalLink className="ml-2 size-4" />
          </div>
        </Button>
      </Link>
      <Button
        onClick={onReset}
        className="mt-4 w-full max-w-sm"
        variant="outline"
      >
        Generate another account
      </Button>
    </div>
  );
};
