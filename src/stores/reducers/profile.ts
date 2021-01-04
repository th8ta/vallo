export interface IProfileAction {
  type: "UPDATE_PROFILE";
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

    default:
      break;
  }

  return state;
}
