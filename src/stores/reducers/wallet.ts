import { JWKInterface } from "arweave/node/lib/wallet";

export interface IWalletAction {
  type: "ADD_WALLET" | "REMOVE_WALLET" | "USER_SIGNOUT";
  payload: {
    keyfile?: JWKInterface;
    address?: string;
    mnemonic?: string;
    eth?: ETHData;
  };
}

interface Wallet {
  keyfile: JWKInterface;
  address: string;
  mnemonic?: string;
  eth: ETHData;
}

interface ETHData {
  address: string;
  publicKey: string;
  privateKey: string;
}

export default function walletReducer(
  state: Wallet[] = [],
  action: IWalletAction
): Wallet[] {
  switch (action.type) {
    case "ADD_WALLET":
      if (
        !action.payload.address ||
        !action.payload.keyfile ||
        state.filter(({ address }) => address === action.payload.address)
          .length > 0 ||
        !action.payload.eth
      )
        break;
      return [
        ...state,
        {
          keyfile: action.payload.keyfile,
          address: action.payload.address,
          mnemonic: action.payload.mnemonic,
          eth: action.payload.eth
        }
      ];

    case "REMOVE_WALLET":
      return state.filter(({ address }) => address !== action.payload.address);

    case "USER_SIGNOUT":
      return [];

    default:
      break;
  }

  return state;
}
