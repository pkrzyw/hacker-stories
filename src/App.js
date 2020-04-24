import React, {
  useState,
  useEffect,
  useRef,
  useReducer,
  useCallback,
} from "react";
import axios from "axios";

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

  useEffect(() => {
    localStorage.setItem(key, value);
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

  const handleRemoveStory = (item) => {
    dispatchStories({
      type: "REMOVE_STORY",
      payload: item,
    });
  };

  function handleSearchInput(event) {
    setSearchTerm(event.target.value);
  }

  function handleSearchSubmit(event) {
    setUrl(`${API_ENDPOINT}${searchTerm}`);
    event.preventDefault();
  }

  return (
    <div>
      <h1>My Hacker Stories</h1>
      <SearchForm
        onSearchSubmit={handleSearchSubmit}
        searchTerm={searchTerm}
        handleSearchInput={handleSearchInput}
      />
      <hr />
      {stories.isError && <p>Something went wrong ...</p>}
      {stories.isLoading ? (
        <p>Loading...</p>
      ) : (
        <List list={stories.data} onRemoveItem={handleRemoveStory} />
      )}
    </div>
  );
};
const SearchForm = ({ onSearchSubmit, searchTerm, handleSearchInput }) => {
  return (
    <form onSubmit={onSearchSubmit}>
      <InputWithLabel
        id="search"
        label="Search"
        value={searchTerm}
        onInputChange={handleSearchInput}
        isFocused
      >
        <strong>Search:</strong>
      </InputWithLabel>
      <button disabled={!searchTerm} type="submit">
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
      <label htmlFor={id}>{children}</label>&nbsp;
      <input
        ref={inputRef}
        id={id}
        type={type}
        value={value}
        onChange={onInputChange}
      />
    </>
  );
};
const List = ({ list, onRemoveItem }) =>
  list.map((item) => (
    <Item item={item} key={item.objectID} onRemoveItem={onRemoveItem} />
  ));

const Item = ({ item, onRemoveItem }) => {
  function handleRemoveItem() {
    onRemoveItem(item);
  }
  return (
    <div>
      <span>
        <a href={item.url}>{item.title}</a>
      </span>{" "}
      <span>{item.author}</span>
      <strong>
        <span>{item.num_comments}</span>
      </strong>
      <span>{item.points}</span>
      <button onClick={handleRemoveItem}>Remove</button>
    </div>
  );
};

export default App;
