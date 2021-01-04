interface IBalance {
  address: string;
  balance: string;
}

export interface IBalanceAction {
  type: "UPDATE_BALANCE";
  payload: {
    address: string;
    balance: string;
  };
}

export default function balanceReducer(
  state: IBalance[] = [],
  action: IBalanceAction
): IBalance[] {
  switch (action.type) {
    case "UPDATE_BALANCE":
      return [
        ...state.filter(({ address }) => address !== action.payload.address),
        { address: action.payload.address, balance: action.payload.balance }
      ];

    default:
      break;
  }

  return state;
}
