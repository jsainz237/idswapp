import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function WalletNotConnected({ children }: Props) {
  return (
    <div className="container flex flex-1 flex-col items-center justify-center self-stretch">
      <h2 className="type-h2 text-center max-md:text-xl">
        Wallet not connected
      </h2>
      <h4 className="type-h4 mt-2 text-center max-md:text-base">{children}</h4>
    </div>
  );
}
