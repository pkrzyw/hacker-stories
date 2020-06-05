import React, { useState, useEffect, useCallback } from "react";
import "./App.css";
import List from "./List";
import SearchForm from "./SearchForm";
import LastSearches from "./LastSearches";
import { useDispatch, useSelector } from "react-redux";
import { doStoriesFetch } from "../actions/stories";
import { getStories } from "../selectors/stories";
const API_BASE = "https://hn.algolia.com/api/v1";
const API_SEARCH = "/search";
const PARAM_SEARCH = "query=";
const PARAM_PAGE = "page=";

const getUrl = (searchTerm, page) =>
  `${API_BASE}${API_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}`;

const useSemiPersistentState = (key, initialState) => {
  const [value, setValue] = useState(localStorage.getItem(key) || initialState);
  useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key]);

  return [value, setValue];
};

const extractSearchTerm = (url) =>
  url
    .substring(url.lastIndexOf("?") + 1, url.lastIndexOf("&"))
    .replace(PARAM_SEARCH, "");

const getLastSearches = (urls) =>
  urls
    .reduce((result, url, index) => {
      const searchTerm = extractSearchTerm(url);
      if (index === 0) {
        return result.concat(searchTerm);
      }
      const previousSearchTerm = result[result.length - 1];
      if (searchTerm === previousSearchTerm) {
        return result;
      } else {
        return result.concat(searchTerm);
      }
    }, [])
    .slice(-6)
    .slice(0, -1);

const App = () => {
  const [searchTerm, setSearchTerm] = useSemiPersistentState("search", "React");
  const [urls, setUrls] = useState([getUrl(searchTerm, 0)]);

  const stories = useSelector((store) => getStories(store));
  const dispatch = useDispatch();

  const handleFetchStories = useCallback(() => {
    dispatch(doStoriesFetch(urls[urls.length - 1]));
  }, [urls, dispatch]);

  useEffect(() => {
    handleFetchStories();
  }, [handleFetchStories]);

  const handleSearchInput = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    handleSearch(searchTerm, 0);
    event.preventDefault();
  };
  const handleLastSearch = (searchTerm) => {
    setSearchTerm(searchTerm);
    handleSearch(searchTerm, 0);
  };

  const handleSearch = (searchTerm, page) => {
    const url = getUrl(searchTerm, page);
    setUrls(urls.concat(url));
  };
  const handleMore = () => {
    const lastUrl = urls[urls.length - 1];
    const searchTerm = extractSearchTerm(lastUrl);
    handleSearch(searchTerm, stories.page + 1);
  };
  const sumComments = getSumComments(stories);
  const lastSearches = getLastSearches(urls);

  return (
    <div className="container">
      <h1 className="headline-primary">
        My Hacker Stories with {sumComments} comments.
      </h1>
      <SearchForm
        onSearchSubmit={handleSearchSubmit}
        searchTerm={searchTerm}
        onSearchInput={handleSearchInput}
      />

      <LastSearches
        lastSearches={lastSearches}
        onLastSearch={handleLastSearch}
      />
      <hr />
      {stories.isError && <p>Something went wrong ...</p>}
      <List />
      {stories.isLoading ? (
        <p>Loading...</p>
      ) : (
        <button
          type="button"
          onClick={handleMore}
          className="button button_large"
        >
          {" "}
          More
        </button>
      )}
    </div>
  );
};

const getSumComments = (stories) => {
  return stories.data.reduce((result, value) => result + value.num_comments, 0);
};

export default App;
