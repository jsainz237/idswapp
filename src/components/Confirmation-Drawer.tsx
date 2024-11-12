import { TriangleAlert } from "lucide-react";

import { Button } from "./ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";

interface ConfirmationDrawerText {
  title: string;
  description: string;
  confirmText: string;
  cancelText: string;
}

interface ConfirmationDrawerProps {
  open: boolean;
  setOpen: (open: boolean) => void;

  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
  text: ConfirmationDrawerText;
  children: React.ReactNode;
}

export function ConfirmationDrawer({
  open,
  setOpen,
  onConfirm,
  onCancel,
  text,
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
              {text.title}
            </DrawerTitle>
            <DrawerDescription>{text.description}</DrawerDescription>
          </DrawerHeader>
          <div className="my-4" />
          <DrawerFooter>
            <Button className="w-full" onClick={onConfirmClick}>
              {text.confirmText}
            </Button>
            <DrawerClose asChild>
              <Button variant="outline" className="w-full" onClick={onCancel}>
                {text.cancelText}
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
