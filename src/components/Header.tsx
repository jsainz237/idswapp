import Image from "next/image";

import { WalletButton } from "./Wallet-Button";

export function Header() {
  return (
    <div className="flex items-center justify-between p-4">
      <Image src="/logo.svg" alt="IDSwapp" width={200} height={200} />
      <WalletButton />
    </div>
  );
}
