import React from "react";
import SortButton from "./SortButton";
import { sortBy } from "lodash";
import { useSelector, useDispatch } from "react-redux";
import { getHits } from "../selectors/stories";
import Item from "./Item";
import { doSortSetField } from "../actions/sort";
import { getSort } from "../selectors/sort";

const SORTS = {
  NONE: (list) => list,
  TITLE: (list) => sortBy(list, "title"),
  AUTHOR: (list) => sortBy(list, "author"),
  COMMENT: (list) => sortBy(list, "num_comments").reverse(),
  POINT: (list) => sortBy(list, "points").reverse(),
};

const List = () => {
  const stories = useSelector((state) => getHits(state));
  const sort = useSelector((state) => getSort(state));
  const dispatch = useDispatch();

  const handleSort = (sortKey) => {
    dispatch(doSortSetField(sortKey));
  };
  const sortFunction = SORTS[sort.sortKey];
  const sortedList = sort.isReverse
    ? sortFunction(stories).reverse()
    : sortFunction(stories);

  return (
    <div>
      <div style={{ display: "flex" }}>
        <span style={{ width: "40%" }}>
          <SortButton currSort={sort} field="TITLE" handleSort={handleSort}>
            Title
          </SortButton>
        </span>
        <span style={{ width: "30%" }}>
          <SortButton currSort={sort} field="AUTHOR" handleSort={handleSort}>
            Author
          </SortButton>
        </span>
        <span style={{ width: "10%" }}>
          <SortButton currSort={sort} field="COMMENT" handleSort={handleSort}>
            Comments
          </SortButton>
        </span>
        <span style={{ width: "10%" }}>
          <SortButton currSort={sort} field="POINT" handleSort={handleSort}>
            Points
          </SortButton>
        </span>
        <span style={{ width: "10%" }}>Actions</span>
      </div>
      {sortedList.map((item) => (
        <Item item={item} key={item.objectID} />
      ))}
    </div>
  );
};

export default List;
