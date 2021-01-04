import { JWKInterface } from "arweave/node/lib/wallet";

export function addWallet(
  keyfile: JWKInterface,
  address: string,
  mnemonic?: string
) {
  return {
    type: "ADD_WALLET",
    payload: { keyfile, address, mnemonic }
  };
}
