import { IToken } from "./tokens";

export interface IAsset extends IToken {
  balance: number;
}

interface IStateItem {
  address: string;
  tokens: IAsset[];
}

export interface IAssetsAction {
  type: "UPDATE_ASSETS" | "SET_BALANCE" | "USER_SIGNOUT";
  payload: IUpdateTokensPayload | ISetBalancePayload;
}

interface IBasePayload {
  address: string;
}

interface IUpdateTokensPayload extends IBasePayload {
  tokens: IAsset[];
}

interface ISetBalancePayload extends IBasePayload {
  tokenID: string;
  balance: number;
}

export default function assetsReducer(
  state: IStateItem[] = [],
  action: IAssetsAction
): IStateItem[] {
  switch (action.type) {
    case "UPDATE_ASSETS":
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

    case "USER_SIGNOUT":
      return [];

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
