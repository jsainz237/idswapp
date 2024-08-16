import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";

export function Header() {
  return (
    <div className="fixed top-0 z-50 flex w-full items-center justify-between bg-background/85 p-4">
      <Image src="/logo.svg" alt="IDSwapp" width={200} height={200} />
      <ConnectButton accountStatus="address" chainStatus="icon" />
    </div>
  );
}
