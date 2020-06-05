import React from "react";
import { ReactComponent as Check } from "../assets/check.svg";
import { useDispatch } from "react-redux";
import { doStoriesRemove } from "../actions/stories";

const Item = ({ item }) => {
  const dispatch = useDispatch();
  const handleRemove = (item) => {
    dispatch(doStoriesRemove(item));
  };
  return (
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
          onClick={() => handleRemove(item)}
          className="button button_small"
        >
          <Check height="18px" width="18px" />
        </button>
      </span>
    </div>
  );
};
export default Item;
