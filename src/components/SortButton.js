import React from "react";
import { ReactComponent as DownArrow } from "../assets/down.svg";
import { ReactComponent as UpArrow } from "../assets/up.svg";
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
export default SortButton;
