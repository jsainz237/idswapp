"use client";

import { createContext, useContext, useReducer } from "react";

interface IWalletContext {
  address?: string;
}

const WalletContext = createContext<IWalletContext>({
  address: undefined,
});

const WalletDispatchContext = createContext<any>(null);

const walletReducer = (state: IWalletContext, action: any) => {
  switch (action.type) {
    case "SET_ADDRESS":
      return { ...state, address: action.payload };
    default:
      return state;
  }
};

export const actions = {
  setAddress: function (address: string) {
    return { type: "SET_ADDRESS", payload: address };
  },
};

export function useWallet() {
  const wallet = useContext(WalletContext);
  const dispatch = useContext(WalletDispatchContext);
  return [wallet, dispatch];
}

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(walletReducer, {
    address: undefined,
  });

  return (
    <WalletContext.Provider value={state}>
      <WalletDispatchContext.Provider value={dispatch}>
        {children}
      </WalletDispatchContext.Provider>
    </WalletContext.Provider>
  );
};
