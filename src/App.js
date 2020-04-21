import React, { useState, useEffect } from "react";

const useSemiPersistentState = (key, initialState) => {
  const [value, setValue] = useState(localStorage.getItem(key) || initialState);

  useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key]);

  return [value, setValue];
};
const App = () => {
  const [searchTerm, setSearchTerm] = useSemiPersistentState("search", "React");

  function handleSearch(event) {
    setSearchTerm(event.target.value);
  }
  const stories = [
    {
      title: "React",
      url: "https://reactjs.org/",
      author: "Jordan Walke",
      num_comments: 3,
      points: 4,
      objectID: 0,
    },
    {
      title: "Redux",
      url: "https://redux.js.org/",
      author: "Dan Abramov, Andrew Clark",
      num_comments: 2,
      points: 5,
      objectID: 1,
    },
  ];
  const searchedStories = stories.filter((story) =>
    story.title.toLowerCase().includes(searchTerm.toLocaleLowerCase())
  );
  return (
    <div>
      <h1>My Hacker Stories</h1>
      <Search search={searchTerm} onSearch={handleSearch} />
      <hr />
      <List list={searchedStories} />
    </div>
  );
};

const List = (props) =>
  props.list.map((item) => <Item item={item} key={item.objectID} />);

const Item = ({ item }) => (
  <div>
    <span>
      <a href={item.url}>{item.title}</a>
    </span>{" "}
    <span>{item.author}</span>
    <strong>
      <span>{item.num_comments}</span>
    </strong>
    <span>{item.points}</span>
  </div>
);

const Search = ({ search, onSearch }) => (
  <div>
    <label htmlFor="search">Search: </label>
    <input id="search" type="text" value={search} onChange={onSearch} />
  </div>
);

export default App;
