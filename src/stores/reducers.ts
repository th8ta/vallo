import { combineReducers } from "redux";

import wallet from "./reducers/wallet";
import balance from "./reducers/balance";
import profile from "./reducers/profile";
import assets from "./reducers/assets";
import tokens from "./reducers/tokens";
import swap from "./reducers/swap";
import theme from "./reducers/theme";

export const plainReducers = {
  wallet,
  balance,
  profile,
  assets,
  tokens,
  swap,
  theme
};
const reducers = combineReducers(plainReducers);

export default reducers;
export type RootState = ReturnType<typeof reducers>;
