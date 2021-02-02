import { createStore, combineReducers } from "redux";

import { loginReducer } from "./reducers/login";
import { adminReducer } from "./reducers/adminReducer";

export const store = createStore(
  combineReducers({
    login: loginReducer,
    admin: adminReducer,
  })
);
