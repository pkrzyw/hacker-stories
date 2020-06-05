import { getStories } from "../api/stories";
import {
  STORIES_FETCH_INIT,
  STORIES_FETCH_SUCCESS,
  STORIES_FETCH_ERROR,
  STORIES_REMOVE,
} from "../constants/actionTypes";
export const doStoriesRemove = (story) => ({
  type: STORIES_REMOVE,
  payload: story,
});
const doStoriesFetchInit = () => ({
  type: STORIES_FETCH_INIT,
});
const doStoriesFetchSuccess = (hits, page) => ({
  type: STORIES_FETCH_SUCCESS,
  payload: {
    list: hits,
    page: page,
  },
});
const doStoriesFetchError = () => ({
  type: STORIES_FETCH_ERROR,
});
export const doStoriesFetch = (url) => {
  return function (dispatch) {
    dispatch(doStoriesFetchInit());
    getStories(url)
      .then((result) => {
        dispatch(doStoriesFetchSuccess(result.data.hits, result.data.page));
      })
      .catch(() => {
        dispatch(doStoriesFetchError());
      });
  };
};
