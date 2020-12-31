import { createContext } from "react";

export interface IToken {
  balance: number;
  id: string;
  ticker: string;
  state: any;
  name: string;
  logo: string;
}

export interface IWallet {
  address: string;
  key?: any;
  mnemonic?: string;
}

export interface IWalletState {
  key: any;
  mnemonic?: string;
  balance: string;
  address: string;
  tokens: IToken[];
  wallets: IWallet[];
  picture?: string;
  blockHeight?: number;
  tokenAddresses?: string[];
}

export const initWalletState: IWalletState = {
  key: null as any,
  balance: "",
  address: "",
  tokens: [],
  tokenAddresses: [],
  wallets: []
};

const WalletContext = createContext<{
  state: IWalletState;
  dispatch: React.Dispatch<any>;
}>({ state: initWalletState, dispatch: () => null });

export default WalletContext;
