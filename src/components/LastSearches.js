import React from "react";

const LastSearches = ({ lastSearches, onLastSearch }) =>
  lastSearches.map((searchTerm, index) => (
    <button
      type="button"
      key={searchTerm + index}
      className="button button_large"
      onClick={() => onLastSearch(searchTerm)}
    >
      {searchTerm}
    </button>
  ));
export default LastSearches;
