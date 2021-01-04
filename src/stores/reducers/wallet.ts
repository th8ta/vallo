import { JWKInterface } from "arweave/node/lib/wallet";

interface IAction {
  type: "ADD_WALLET" | "REMOVE_WALLET" | "REMOVE_ALL";
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
  action: IAction
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

    case "REMOVE_ALL":
      return [];

    default:
      break;
  }

  return state;
}
