import { JWKInterface } from "arweave/node/lib/wallet";
import { IWalletAction } from "./reducers/wallet";
import { IBalanceAction } from "./reducers/balance";
import { IProfileAction } from "./reducers/profile";

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
