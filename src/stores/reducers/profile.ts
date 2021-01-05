export interface IProfileAction {
  type: "UPDATE_PROFILE" | "USER_SIGNOUT";
  payload: {
    address: string;
  };
}

export default function profileReducer(
  state: string = "",
  action: IProfileAction
): string {
  switch (action.type) {
    case "UPDATE_PROFILE":
      return action.payload.address;

    case "USER_SIGNOUT":
      return "";

    default:
      break;
  }

  return state;
}
