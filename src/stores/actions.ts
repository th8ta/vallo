import { JWKInterface } from "arweave/node/lib/wallet";
import { IWalletAction } from "./reducers/wallet";
import { IBalanceAction } from "./reducers/balance";
import { IProfileAction } from "./reducers/profile";
import { IAssetsAction, IAsset } from "./reducers/assets";
import { ITokensAction, IToken } from "./reducers/tokens";
import { ISwapAction, ISwap } from "./reducers/swap";
import { IThemeAction, UserTheme } from "./reducers/theme";
import { Currency, ICurrencyAction } from "./reducers/currency";

export function addWallet(
  keyfile: JWKInterface,
  address: string,
  mnemonic?: string
): IWalletAction {
  return {
    type: "ADD_WALLET",
    payload: { keyfile, address, mnemonic }
  };
}

export function removeWallet(address: string): IWalletAction {
  return {
    type: "REMOVE_WALLET",
    payload: { address }
  };
}

export function signOut() {
  return {
    type: "USER_SIGNOUT",
    payload: {}
  };
}

export function updateBalance(
  address: string,
  balance: string
): IBalanceAction {
  return {
    type: "UPDATE_BALANCE",
    payload: { address, balance }
  };
}

export function setProfile(address: string): IProfileAction {
  return {
    type: "UPDATE_PROFILE",
    payload: { address }
  };
}

export function setAssets(address: string, tokens: IAsset[]): IAssetsAction {
  return {
    type: "UPDATE_ASSETS",
    payload: { address, tokens }
  };
}

export function setBalance(
  address: string,
  tokenID: string,
  balance: number
): IAssetsAction {
  return {
    type: "SET_BALANCE",
    payload: { address, tokenID, balance }
  };
}

export function setTokens(tokens: IToken[]): ITokensAction {
  return {
    type: "UPDATE_TOKENS",
    payload: { tokens }
  };
}

export function addToken(tokens: IToken[]): ITokensAction {
  return {
    type: "ADD_TOKENS",
    payload: { tokens }
  };
}

export function updateSwapItems(items: ISwap): ISwapAction {
  return {
    type: "UPDATE_SWAP",
    payload: items
  };
}

export function setTheme(theme: UserTheme): IThemeAction {
  return {
    type: "UPDATE_THEME",
    payload: theme
  };
}

export function setCurrencyVal(currency: Currency): ICurrencyAction {
  return {
    type: "CURRENCY_VAL",
    payload: { currency }
  };
}

export function setCurrency(status: boolean): ICurrencyAction {
  return {
    type: "CURRENCY_STATUS",
    payload: { status }
  };
}
