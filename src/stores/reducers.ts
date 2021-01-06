import { combineReducers } from "redux";
import wallet from "./reducers/wallet";
import balance from "./reducers/balance";
import profile from "./reducers/profile";
import token from "./reducers/tokens";

export const plainReducers = { wallet, balance, profile, token };
const reducers = combineReducers(plainReducers);

export default reducers;
export type RootState = ReturnType<typeof reducers>;
