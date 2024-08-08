"use client";

import { useEffect, useRef, useState } from "react";
import MetaMaskOnboarding from "@metamask/onboarding";

import { actions, useWallet } from "./context/wallet-context";
import { Button } from "./ui/button";

const ONBOARD_TEXT = "Install MetaMask!";
const CONNECT_TEXT = "Connect Wallet";

export function WalletButton() {
  const [wallet, dispatch] = useWallet();
  const [buttonText, setButtonText] = useState(ONBOARD_TEXT);
  const [isDisabled, setDisabled] = useState(false);
  const [accounts, setAccounts] = useState<any[]>([]);
  const onboarding = useRef<MetaMaskOnboarding>();

  useEffect(() => {
    if (wallet.address) {
      setButtonText(`0x...${wallet.address.slice(-5)}`);
    }
  }, [wallet.address]);

  useEffect(() => {
    if (!onboarding.current) {
      onboarding.current = new MetaMaskOnboarding();
    }
  }, []);

  useEffect(() => {
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      if (accounts.length > 0) {
        dispatch(actions.setAddress(accounts[0]));
        onboarding.current?.stopOnboarding();
      } else {
        setButtonText(CONNECT_TEXT);
        setDisabled(false);
      }
    }
  }, [dispatch, accounts]);

  useEffect(() => {
    function handleNewAccounts(newAccounts: any[]) {
      setAccounts(newAccounts);
    }

    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then(handleNewAccounts);
      window.ethereum.on("accountsChanged", handleNewAccounts);

      return () => {
        window.ethereum.removeListener("accountsChanged", handleNewAccounts);
      };
    }
  }, []);

  const onClick = () => {
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((newAccounts: any[]) => setAccounts(newAccounts));
    } else {
      onboarding.current?.startOnboarding();
    }
  };

  return (
    <Button onClick={onClick} disabled={isDisabled}>
      {buttonText}
    </Button>
  );
}
