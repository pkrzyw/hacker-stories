import React from "react";
import InputWithLabel from "./InputWithLabel";
const SearchForm = ({ onSearchSubmit, searchTerm, onSearchInput }) => (
  <form onSubmit={onSearchSubmit} className="search-form">
    <InputWithLabel
      id="search"
      label="Search"
      value={searchTerm}
      onInputChange={onSearchInput}
      isFocused
    >
      <strong>Search:</strong>
    </InputWithLabel>
    <button
      disabled={!searchTerm}
      type="submit"
      className="button button_large"
    >
      Submit
    </button>
  </form>
);
export default SearchForm;
