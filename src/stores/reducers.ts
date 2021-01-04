import { combineReducers } from "redux";
import wallet from "./reducers/wallet";
import balance from "./reducers/balance";
import profile from "./reducers/profile";

const reducers = combineReducers({ wallet, balance, profile });

export default reducers;
export type RootState = ReturnType<typeof reducers>;
