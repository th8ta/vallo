export interface IToken {
  id: string;
  name: string;
  ticker: string;
  balance: number;
}

interface IStateItem {
  address: string;
  tokens: IToken[];
}

export interface ITokenAction {
  type: "UPDATE_TOKENS" | "SET_BALANCE";
  payload: IUpdateTokensPayload | ISetBalancePayload;
}

interface IBasePayload {
  address: string;
}

interface IUpdateTokensPayload extends IBasePayload {
  tokens: IToken[];
}

interface ISetBalancePayload extends IBasePayload {
  tokenID: string;
  balance: number;
}

export default function tokenReducer(
  state: IStateItem[] = [],
  action: ITokenAction
): IStateItem[] {
  switch (action.type) {
    case "UPDATE_TOKENS":
      return isUpdate(action.payload)
        ? [
            ...state.filter(
              ({ address }) => address !== action.payload.address
            ),
            { address: action.payload.address, tokens: action.payload.tokens }
          ]
        : state;

    case "SET_BALANCE":
      return !isUpdate(action.payload)
        ? state.map((val) =>
            val.address === action.payload.address
              ? {
                  ...val,
                  tokens: val.tokens.map((token) =>
                    !isUpdate(action.payload) &&
                    token.id === action.payload.tokenID
                      ? {
                          ...token,
                          balance: action.payload.balance
                        }
                      : token
                  )
                }
              : val
          )
        : state;

    default:
      break;
  }

  return state;
}

function isUpdate(
  payload: IUpdateTokensPayload | ISetBalancePayload
): payload is IUpdateTokensPayload {
  return (payload as IUpdateTokensPayload).tokens !== undefined;
}
