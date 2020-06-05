import { SORT_SET_FIELD } from "../constants/actionTypes";
const INITIAL_STATE = {
  sortKey: "NONE",
  isReverse: false,
};
const sortReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SORT_SET_FIELD:
      return applySortSetField(state, action);
    default:
      return state;
  }
};
function applySortSetField(state, action) {
  return {
    sortKey: action.payload,
    isReverse: state.sortKey === action.payload ? !state.isReverse : false,
  };
}
export default sortReducer;
