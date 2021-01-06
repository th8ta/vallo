export interface IToken {
  id: string;
  name: string;
  ticker: string;
}

export interface ITokensAction {
  type: "UPDATE_TOKENS" | "ADD_TOKENS";
  payload: {
    tokens: IToken[];
  };
}

export default function tokensReducer(
  state: IToken[] = [],
  action: ITokensAction
): IToken[] {
  switch (action.type) {
    case "UPDATE_TOKENS":
      return action.payload.tokens;

    case "ADD_TOKENS":
      return [
        ...state.filter(
          ({ id }) =>
            action.payload.tokens.map((newTokens) => newTokens.id === id)
              .length < 1
        ),
        ...action.payload.tokens
      ];

    default:
      break;
  }

  return state;
}
