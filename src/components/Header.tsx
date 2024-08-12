import Image from "next/image";

import { WalletButton } from "./Wallet-Button";

export function Header() {
  return (
    <div className="fixed top-0 z-50 flex w-full items-center justify-between bg-background/85 p-4">
      <Image src="/logo.svg" alt="IDSwapp" width={200} height={200} />
      <WalletButton />
    </div>
  );
}
