import React, {
  useState,
  useEffect,
  useRef,
  useReducer,
  useCallback,
  memo,
} from "react";
import axios from "axios";
import "./App.css";
import { ReactComponent as Check } from "./check.svg";

const API_ENDPOINT = "https://hn.algolia.com/api/v1/search?query=";

const storiesReducer = (state, action) => {
  switch (action.type) {
    case "STORIES_FETCH_INIT":
      return { ...state, isLoading: true, isError: false };
    case "STORIES_FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    case "STORIES_FETCH_FAILURE":
      return { ...state, isError: true, isLoading: false };
    case "REMOVE_STORY":
      return {
        ...state,
        data: state.data.filter(
          (story) => story.objectID !== action.payload.objectID
        ),
      };
    default:
      throw new Error();
  }
};

const useSemiPersistentState = (key, initialState) => {
  const [value, setValue] = useState(localStorage.getItem(key) || initialState);
  const isMounted = useRef(false);
  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
    } else {
      localStorage.setItem(key, value);
    }
  }, [value, key]);

  return [value, setValue];
};

const App = () => {
  const [searchTerm, setSearchTerm] = useSemiPersistentState("search", "React");
  const [stories, dispatchStories] = useReducer(storiesReducer, {
    data: [],
    isLoading: false,
    isError: false,
  });
  const [url, setUrl] = useState(`${API_ENDPOINT}${searchTerm}`);

  const handleFetchStories = useCallback(async () => {
    dispatchStories({ type: "STORIES_FETCH_INIT" });
    try {
      const result = await axios.get(url);
      dispatchStories({
        type: "STORIES_FETCH_SUCCESS",
        payload: result.data.hits,
      });
    } catch {
      dispatchStories({ type: "STORIES_FETCH_FAILURE" });
    }
  }, [url]);

  useEffect(() => {
    handleFetchStories();
  }, [handleFetchStories]);

  const handleRemoveStory = useCallback((item) => {
    dispatchStories({
      type: "REMOVE_STORY",
      payload: item,
    });
  }, []);

  function handleSearchInput(event) {
    setSearchTerm(event.target.value);
  }

  function handleSearchSubmit(event) {
    setUrl(`${API_ENDPOINT}${searchTerm}`);
    event.preventDefault();
  }
  console.log("B:App");
  return (
    <div className="container">
      <h1 className="headline-primary">My Hacker Stories</h1>
      <SearchForm
        onSearchSubmit={handleSearchSubmit}
        searchTerm={searchTerm}
        onSearchInput={handleSearchInput}
      />
      {stories.isError && <p>Something went wrong ...</p>}
      {stories.isLoading ? (
        <p>Loading...</p>
      ) : (
        <List list={stories.data} onRemoveItem={handleRemoveStory} />
      )}
    </div>
  );
};
const SearchForm = ({ onSearchSubmit, searchTerm, onSearchInput }) => {
  return (
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
};
const InputWithLabel = ({
  id,
  type = "text",
  value,
  onInputChange,
  isFocused,
  children,
}) => {
  const inputRef = useRef();
  useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isFocused]);
  return (
    <>
      <label htmlFor={id} className="label">
        {children}
      </label>
      &nbsp;
      <input
        ref={inputRef}
        id={id}
        type={type}
        value={value}
        onChange={onInputChange}
        className="input"
      />
    </>
  );
};
const List = memo(
  ({ list, onRemoveItem }) =>
    console.log("B:List") ||
    list.map((item) => (
      <Item item={item} key={item.objectID} onRemoveItem={onRemoveItem} />
    ))
);

const Item = ({ item, onRemoveItem }) => (
  <div className="item">
    <span style={{ width: "40%" }}>
      <a href={item.url}>{item.title}</a>{" "}
    </span>
    <span style={{ width: "30%" }}>{item.author}</span>{" "}
    <span style={{ width: "10%" }}>{item.num_comments}</span>{" "}
    <span style={{ width: "10%" }}>{item.points}</span>{" "}
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

export default App;
