import { createStore, applyMiddleware } from "redux";
import rootReducer from "../reducers";
import ReduxThunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";

const store = createStore(
  rootReducer,
  undefined,
  composeWithDevTools(applyMiddleware(ReduxThunk))
);

export default store;
