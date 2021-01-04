import { JWKInterface } from "arweave/node/lib/wallet";

interface IAction {
  type: "ADD_WALLET" | "REMOVE_WALLET" | "REMOVE_ALL";
  payload: {
    keyfile?: JWKInterface;
    address?: string;
  };
}

interface Wallet {
  keyfile: JWKInterface;
  address: string;
}

export default function walletReducer(state: Wallet[] = [], action: IAction) {
  switch (action.type) {
    case "ADD_WALLET":
      if (
        state.filter(({ address }) => address === action.payload.address)
          .length > 0
      )
        break;
      return [
        ...state,
        { keyfile: action.payload.keyfile, address: action.payload.address }
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
