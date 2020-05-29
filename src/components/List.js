import React, { useState } from "react";
import { ReactComponent as Check } from "../assets/check.svg";
import { ReactComponent as DownArrow } from "../assets/down.svg";
import { ReactComponent as UpArrow } from "../assets/up.svg";
import { sortBy } from "lodash";

const SORTS = {
  NONE: (list) => list,
  TITLE: (list) => sortBy(list, "title"),
  AUTHOR: (list) => sortBy(list, "author"),
  COMMENT: (list) => sortBy(list, "num_comments").reverse(),
  POINT: (list) => sortBy(list, "points").reverse(),
};

const List = ({ list, onRemoveItem }) => {
  const [sort, setSort] = useState({ sortKey: "NONE", isReverse: false });

  const handleSort = (sortKey) => {
    const isReverse = sort.sortKey === sortKey && !sort.isReverse;
    setSort({ sortKey, isReverse });
  };
  const sortFunction = SORTS[sort.sortKey];
  const sortedList = sort.isReverse
    ? sortFunction(list).reverse()
    : sortFunction(list);
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
        <Item item={item} key={item.objectID} onRemoveItem={onRemoveItem} />
      ))}
    </div>
  );
};

const Item = ({ item, onRemoveItem }) => (
  <div className="item" style={{ display: "flex" }}>
    <span style={{ width: "40%" }}>
      <a href={item.url}>{item.title}</a>
    </span>
    <span style={{ width: "30%" }}>{item.author}</span>
    <span style={{ width: "10%" }}>{item.num_comments}</span>
    <span style={{ width: "10%" }}>{item.points}</span>
    <span style={{ width: "10%" }}>
      <button
        type="button"
        onClick={() => onRemoveItem(item)}
        className="button button_small"
      >
        <Check height="18px" width="18px" />
      </button>
    </span>
  </div>
);
const SortButton = ({ field, currSort, handleSort, children }) => (
  <button
    className="button button_small"
    style={currSort.sortKey === field ? { background: "grey" } : null}
    onClick={() => handleSort(field)}
  >
    {children}{" "}
    {currSort.sortKey === field ? (
      currSort.isReverse ? (
        <UpArrow height="8px" width="8px" />
      ) : (
        <DownArrow height="8px" width="8px" />
      )
    ) : null}
  </button>
);
export default List;
