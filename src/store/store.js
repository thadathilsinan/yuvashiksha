import { createStore, combineReducers } from "redux";

import { loginReducer } from "./reducers/login";

export const store = createStore(
  combineReducers({
    login: loginReducer,
  })
);
