export interface ISwap {
  from?: string;
  to?: string;
}

export interface ISwapAction {
  type: "UPDATE_SWAP" | "USER_SIGNOUT";
  payload: ISwap;
}

export default function swapReducer(
  state: ISwap = {},
  action: ISwapAction
): ISwap {
  switch (action.type) {
    case "UPDATE_SWAP":
      return Object.assign({}, state, action.payload);

    case "USER_SIGNOUT":
      return {};

    default:
      break;
  }
  return state;
}
