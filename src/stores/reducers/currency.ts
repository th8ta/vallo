export interface ICurrencyAction {
  type: "CURRENCY_STATUS" | "CURRENCY_VAL";
  payload: {
    status?: boolean;
    currency?: Currency;
  };
}

export type Currency = "USD" | "EUR" | "GBP";

interface IState {
  status: boolean;
  currency: Currency;
}

export default function currencyReducer(
  state: IState = { status: true, currency: "USD" },
  action: ICurrencyAction
): IState {
  switch (action.type) {
    case "CURRENCY_STATUS":
      if (action.payload.status === undefined) break;
      return { ...state, status: action.payload.status };

    case "CURRENCY_VAL":
      if (!action.payload.currency) break;
      return { ...state, currency: action.payload.currency };
  }

  return state;
}
