import { JWKInterface } from "arweave/node/lib/wallet";
import { IWalletAction } from "./reducers/wallet";
import { IBalanceAction } from "./reducers/balance";
import { IProfileAction } from "./reducers/profile";
import { ITokenAction, IToken } from "./reducers/tokens";

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

export function setTokens(address: string, tokens: IToken[]): ITokenAction {
  return {
    type: "UPDATE_TOKENS",
    payload: { address, tokens }
  };
}

export function setBalance(
  address: string,
  tokenID: string,
  balance: number
): ITokenAction {
  return {
    type: "SET_BALANCE",
    payload: { address, tokenID, balance }
  };
}
