import { STORIES_REMOVE } from "../constants/actionTypes";
const INITIAL_STATE = {
  data: [],
};
const archiveReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case STORIES_REMOVE:
      return applyArchiveAdd(state, action);
    default:
      return state;
  }
};
const applyArchiveAdd = (state, action) => {
  return {
    ...state,
    data: state.data.concat(action.payload),
  };
};
export default archiveReducer;
