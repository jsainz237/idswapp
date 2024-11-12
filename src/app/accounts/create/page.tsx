"use client";

import { useMemo, useState } from "react";
import { LoaderPinwheel } from "lucide-react";
import { useAccount, useReadContract, useWriteContract } from "wagmi";

import { IDSwappFactoryAbi } from "@/abi-gen";
import { ConfirmationDrawer } from "@/components/Confirmation-Drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import WalletNotConnected from "@/components/WalletNotConnected";
import { useBreakpoints } from "@/hooks/useBreakpoints";
import { isEmail } from "@/lib/utils";

export default function CreatePage() {
  const [email, setEmail] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [isWriting, setIsWriting] = useState<boolean>(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { max } = useBreakpoints();

  const wallet = useAccount();
  const { writeContract } = useWriteContract();

  const { data: subdomain, isLoading: isLoadingSubdomain } = useReadContract({
    abi: IDSwappFactoryAbi,
    address: process.env.NEXT_PUBLIC_FACTORY_ADDRESS as `0x${string}`,
    functionName: "subdomainCounter",
  });

  const isLoading = useMemo(() => {
    return isLoadingSubdomain || isWriting;
  }, [isLoadingSubdomain, isWriting]);

  const isValidEmail = useMemo(() => {
    return isEmail(email);
  }, [email]);

  const generateAccount = () => {
    setIsWriting(true);
    writeContract(
      {
        abi: IDSwappFactoryAbi,
        address: process.env.NEXT_PUBLIC_FACTORY_ADDRESS as `0x${string}`,
        functionName: "createAccount",
        args: [email],
      },
      {
        onSuccess: () => {
          setSuccess(true);
        },
        onSettled: () => {
          setDrawerOpen(false);
          setIsWriting(false);
        },
        onError: err => {
          toast({
            title: "Error",
            description: err.message,
            variant: "destructive",
          });
        },
      },
    );
  };

  if (!wallet.address) {
    return <WalletNotConnected />;
  }

  if (isLoading)
    return (
      <div className="container flex flex-1 flex-col items-center justify-center">
        <LoaderPinwheel className="size-10 animate-spin-slow" />
      </div>
    );

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
