import {
  STORIES_FETCH_ERROR,
  STORIES_FETCH_SUCCESS,
  STORIES_FETCH_INIT,
  STORIES_REMOVE,
} from "../constants/actionTypes";
const INITIAL_STATE = {
  isLoading: false,
  isError: false,
  data: [],
  page: 0,
};
export default function storiesReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case STORIES_FETCH_INIT:
      return applyStoriesFetchInit(state);
    case STORIES_FETCH_SUCCESS:
      return applyStoriesFetchSuccess(state, action);
    case STORIES_FETCH_ERROR:
      return applyStoriesFetchFailure(state);
    case STORIES_REMOVE:
      return applyStoriesRemove(state, action);
    default:
      return state;
  }
}
const applyStoriesFetchInit = (state) => {
  return { ...state, isLoading: true, isError: false };
};
const applyStoriesFetchSuccess = (state, action) => {
  return {
    ...state,
    isLoading: false,
    isError: false,
    data:
      action.payload.page === 0
        ? action.payload.list
        : state.data.concat(action.payload.list),
    page: action.payload.page,
  };
};
const applyStoriesFetchFailure = (state) => {
  return { ...state, isError: true, isLoading: false };
};
const applyStoriesRemove = (state, action) => {
  return {
    ...state,
    data: state.data.filter(
      (story) => story.objectID !== action.payload.objectID
    ),
  };
};
