interface IBalance {
  address: string;
  balance: string;
}

export interface IBalanceAction {
  type: "UPDATE_BALANCE" | "REMOVE_WALLET" | "USER_SIGNOUT";
  payload: {
    address: string;
    balance?: string;
  };
}

export default function balanceReducer(
  state: IBalance[] = [],
  action: IBalanceAction
): IBalance[] {
  switch (action.type) {
    case "UPDATE_BALANCE":
      if (!action.payload.balance) break;
      return [
        ...state.filter(({ address }) => address !== action.payload.address),
        { address: action.payload.address, balance: action.payload.balance }
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
