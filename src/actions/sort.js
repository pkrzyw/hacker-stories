import { SORT_SET_FIELD } from "../constants/actionTypes";

export const doSortSetField = (field) => {
  return {
    type: SORT_SET_FIELD,
    payload: field,
  };
};
