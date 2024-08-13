"use client";

import { useEffect, useRef, useState } from "react";
import MetaMaskOnboarding from "@metamask/onboarding";
import { Wallet } from "lucide-react";

import { useWallet, actions } from "./context/wallet-context";
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
    if (!onboarding.current) {
      onboarding.current = new MetaMaskOnboarding();
    }
  }, []);

  useEffect(() => {
    (async () => {
      if (MetaMaskOnboarding.isMetaMaskInstalled()) {
        if (accounts.length > 0) {
          const [account] = accounts;
          setButtonText(`0x...${account.slice(-5)}`);
          onboarding.current?.stopOnboarding();
          dispatch?.(await actions.refreshWallet());
        } else {
          setButtonText(CONNECT_TEXT);
          setDisabled(false);
        }
      }
    })();
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
      {wallet.signer ? <Wallet size={16} className="mr-2" /> : null}
      {buttonText}
    </Button>
  );
}
