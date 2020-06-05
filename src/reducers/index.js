import { combineReducers } from "redux";
import archiveReducer from "./archive";
import storiesReducer from "./stories";
import sortReducer from "./sort";

const rootReducer = combineReducers({
  archive: archiveReducer,
  stories: storiesReducer,
  sort: sortReducer,
});
export default rootReducer;
