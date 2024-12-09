"use client";

import { useState } from "react";

import { useLocalStorage } from "@/hooks/useLocalStorage";

import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Label } from "./ui/label";

export function TermsOfServiceWarning() {
  const [open, setOpen] = useState(true);
  const [checked, setChecked] = useState(false);

  const [acceptedTerms, setAcceptedTerms] = useLocalStorage(
    "acceptedTerms",
    false,
  );

  if (acceptedTerms) return null;

  const handleAccept = (value: boolean) => {
    setChecked(value);
  };

  const handleClose = () => {
    setOpen(false);
    setAcceptedTerms(true);
  };

  return (
    <Dialog open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>⚠️ WARNING: Read before using IDSwapp</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <p className="mb-4">
            Trading accounts often violates the Terms of Service (ToS) of
            various platforms and services. Before utilizing IDSwapp, we
            strongly recommend that you carefully review the Terms of Service
            for any accounts you intend to trade.
          </p>
          <p>
            Neither IDSwapp nor its developers assume any liability for
            consequences resulting from violations of third-party Terms of
            Service agreements. Users are solely responsible for ensuring
            compliance with all applicable terms and conditions of the services
            they interact with.
          </p>
        </DialogDescription>
        <DialogFooter>
          <div className="mt-4 flex w-full flex-col items-start gap-4">
            <div className="flex w-full items-center gap-2">
              <Checkbox
                id="terms"
                checked={checked}
                onCheckedChange={handleAccept}
              />
              <Label htmlFor="terms">
                I have read and agree to the Terms of Service
              </Label>
            </div>
            <Button disabled={!checked} onClick={handleClose}>
              Continue
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
