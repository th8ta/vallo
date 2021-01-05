import { combineReducers } from "redux";
import wallet from "./reducers/wallet";
import balance from "./reducers/balance";
import profile from "./reducers/profile";

export const plainReducers = { wallet, balance, profile };
const reducers = combineReducers(plainReducers);

export default reducers;
export type RootState = ReturnType<typeof reducers>;
