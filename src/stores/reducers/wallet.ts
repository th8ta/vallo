import { JWKInterface } from "arweave/node/lib/wallet";

export interface IWalletAction {
  type: "ADD_WALLET" | "REMOVE_WALLET" | "USER_SIGNOUT";
  payload: {
    keyfile?: JWKInterface;
    address?: string;
    mnemonic?: string;
  };
}

interface Wallet {
  keyfile: JWKInterface;
  address: string;
  mnemonic?: string;
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
          .length > 0
      )
        break;
      return [
        ...state,
        {
          keyfile: action.payload.keyfile,
          address: action.payload.address,
          mnemonic: action.payload.mnemonic
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
