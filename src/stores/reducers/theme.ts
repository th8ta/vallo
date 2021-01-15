export type UserTheme = "Auto" | "Dark" | "Light";

export interface IThemeAction {
  type: "UPDATE_THEME";
  payload: UserTheme;
}

export default function themeReducer(
  state: UserTheme = "Auto",
  action: IThemeAction
): UserTheme {
  if (action.type === "UPDATE_THEME") {
    return action.payload;
  }

  return state;
}
