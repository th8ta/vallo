import { createStore } from "redux";
import reducers from "./reducers";

function saveLocal(state: any) {
  try {
    const serialisedState = JSON.stringify(state);
    localStorage.setItem("persistantState", serialisedState);
  } catch {}
}

function loadLocal() {
  try {
    const serialisedState = localStorage.getItem("persistantState");
    if (serialisedState === null) return undefined;

    return JSON.parse(serialisedState);
  } catch {
    return undefined;
  }
}

const store = createStore(reducers, loadLocal());

store.subscribe(() => saveLocal(store.getState()));

export default store;
