"use client";

import { useEffect, useState } from "react";
import { formatEther } from "ethers";
import { TriangleAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAccount, useReadContract, useWriteContract } from "wagmi";

import { IDSwappAccountAbi } from "@/abi-gen";
import { AccountSkeleton } from "@/components/Account-Skeleton";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

import IDSwappAccount from "../../../../../artifacts/contracts/idswapp-account.sol/IDSwappAccount.json";

interface FormData {
  email: string;
  description: string;
  price: bigint;
  purchasable: boolean;
}

const initialFormData: FormData = {
  email: "",
  description: "",
  price: 0n,
  purchasable: false,
};

interface EditAccountPageProps {
  params: {
    address: string;
  };
}

export default function EditAccountPage({ params }: EditAccountPageProps) {
  const router = useRouter();
  const { address: account } = useAccount();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const { toast } = useToast();
  const { writeContract } = useWriteContract();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { data: publicData, isLoading: publicLoading } = useReadContract({
    abi: IDSwappAccountAbi,
    address: params.address as `0x${string}`,
    functionName: "publicDetails",
  });

  const { data: privateData, isLoading: privateLoading } = useReadContract({
    abi: IDSwappAccountAbi,
    address: params.address as `0x${string}`,
    functionName: "privateDetails",
  });

  const [contract, owner, description, price, purchasable] = publicData || [];
  const [subdomain, email] = privateData || [];
  const isLoading = publicLoading || privateLoading;

  useEffect(() => {
    if (isLoading) return;

    const formData = { email, description, price, purchasable };
    setFormData(formData as FormData);
  }, [email, description, price, purchasable, isLoading]);

  const updateFormField = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (isLoading) return <LoadingScreen />;
  if (!contract || owner !== account) return <AccessDeniedScreen />;

  const saveChanges = () => {
    writeContract(
      {
        abi: IDSwappAccountAbi,
        address: params.address as `0x${string}`,
        functionName: "setDetails",
        args: [
          formData.email,
          formData.description,
          formData.price,
          formData.purchasable,
        ],
      },
      {
        onSuccess: () =>
          toast({ title: "Success", description: "Account details updated" }),
        onError: err =>
          toast({
            variant: "destructive",
            title: "Error",
            description: err.message,
          }),
      },
    );
  };

  return (
    <div className="p-header container max-w-xl">
      <div className="pt-10">
        <h2 className="type-h2 border-b-0 font-mono">
          Edit Account {subdomain}
        </h2>
        <Card className="p-6">
          <h4 className="type-h4 mb-2 font-mono">Forward Email</h4>
          <Input
            type="email"
            value={formData.email}
            onChange={e => updateFormField("email", e.target.value)}
          />

          <h4 className="type-h4 mb-2 mt-8 font-mono">Description</h4>
          <Textarea
            placeholder="Describe the external services this account is linked to."
            value={formData.description}
            onChange={e => updateFormField("description", e.target.value)}
          />

          <h4 className="type-h4 mb-2 mt-8 font-mono">Price (BNB)</h4>
          <Input
            type="number"
            value={formatEther(formData.price)}
            min={0}
            step="0.01"
            onChange={e =>
              updateFormField(
                "price",
                BigInt(parseFloat(e.target.value) * 1e18),
              )
            }
          />

          <h4 className="type-h4 mb-2 mt-8 font-mono">Purchasable</h4>
          <div className="flex items-center space-x-2">
            <Switch
              id="purchasable"
              checked={formData.purchasable}
              onCheckedChange={checked =>
                updateFormField("purchasable", checked)
              }
            />
            <Label htmlFor="purchasable" className="text-muted-foreground">
              Available for purchase
            </Label>
          </div>

          <div className="mt-12 flex space-x-4">
            <ConfirmationDrawer
              open={drawerOpen}
              setOpen={setDrawerOpen}
              onConfirm={saveChanges}
            >
              <Button>Save Changes</Button>
            </ConfirmationDrawer>
            <Button
              variant="outline"
              onClick={() => router.push("/my-accounts")}
            >
              Cancel
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

function LoadingScreen() {
  return (
    <div className="p-header container max-w-xl">
      <div className="pt-10">
        <p className="my-4 text-center font-mono text-muted">
          Loading...please wait
        </p>
        <AccountSkeleton />
      </div>
    </div>
  );
}

function AccessDeniedScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="type-h2 font-mono">Access Denied</h1>
        <p className="text-muted-foreground">
          The account you are looking for does not exist or you are not the
          owner.
        </p>
      </div>
    </div>
  );
}

interface ConfirmationDrawerProps {
  open: boolean;
  setOpen: (open: boolean) => void;

  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
  children: React.ReactNode;
}

function ConfirmationDrawer({
  open,
  setOpen,
  onConfirm,
  onCancel,
  children,
}: ConfirmationDrawerProps) {
  const onConfirmClick = async () => {
    await onConfirm?.();
    setOpen(false);
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle className="flex items-center max-sm:justify-center">
              <TriangleAlert className="mr-4 text-yellow-500" />
              Gas Fee Warning
            </DrawerTitle>
            <DrawerDescription>
              Changing the details of your account will require a gas fee to be
              paid.
            </DrawerDescription>
          </DrawerHeader>
          <div className="my-4" />
          <DrawerFooter>
            <Button className="w-full" onClick={onConfirmClick}>
              Confirm and save
            </Button>
            <DrawerClose asChild>
              <Button variant="outline" className="w-full" onClick={onCancel}>
                Cancel
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
