"use client";

import {
  createContext,
  Dispatch,
  useContext,
  useEffect,
  useReducer,
} from "react";
import { ethers, JsonRpcProvider } from "ethers";

interface IWalletState {
  signer?: ethers.Signer;
  provider?: ethers.BrowserProvider | JsonRpcProvider;
}

const initialWalletState: IWalletState = {
  signer: undefined,
  provider: undefined,
};

const WalletContext = createContext<IWalletState>(initialWalletState);
const WalletDispatchContext = createContext<Dispatch<any> | null>(null);

const walletReducer = (state: IWalletState, action: any): IWalletState => {
  switch (action.type) {
    case "SET_WALLET":
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export const actions = {
  refreshWallet: async function () {
    if (!window.ethereum) return;

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return { type: "SET_WALLET", payload: { provider, signer } };
  },
};

export function useWallet(): [IWalletState, Dispatch<any> | null] {
  const wallet = useContext(WalletContext);
  const dispatch = useContext(WalletDispatchContext);
  return [wallet, dispatch];
}

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(walletReducer, initialWalletState);

  useEffect(() => {
    console.log(state);
  }, [state]);

  return (
    <WalletContext.Provider value={state}>
      <WalletDispatchContext.Provider value={dispatch}>
        {children}
      </WalletDispatchContext.Provider>
    </WalletContext.Provider>
  );
};
