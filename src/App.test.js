import React from "react";
import renderer from "react-test-renderer";
import { mount } from "enzyme";

import App, {
  Item,
  List,
  SearchForm,
  InputWithLabel,
  storiesReducer,
} from "./App";
import axios from "axios";
jest.mock("axios");

describe("Item", () => {
  const item = {
    title: "React",
    url: "https://reactjs.org/",
    author: "Jordan Walke",
    num_comments: 3,
    points: 4,
    objectID: 0,
  };
  const handleRemoveItem = jest.fn();
  let component;

  beforeEach(() => {
    component = renderer.create(
      <Item item={item} onRemoveItem={handleRemoveItem} />
    );
  });

  it("renders all properties", () => {
    expect(component.root.findByType("a").props.href).toEqual(
      "https://reactjs.org/"
    );
    expect(
      component.root.findAllByProps({ children: "Jordan Walke" }).length
    ).toEqual(1);
    expect(component.root.findAllByProps({ children: "React" }).length).toEqual(
      1
    );
  });
  it("calls onRemoveItem on button click", () => {
    component.root.findByType("button").props.onClick();

    expect(handleRemoveItem).toHaveBeenCalledTimes(1);
    expect(handleRemoveItem).toHaveBeenCalledWith(item);

    expect(component.root.findAllByType(Item).length).toEqual(1);
  });
  it("renders snapshot", () => {
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
describe("List", () => {
  const list = [
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
  it("renders two items", () => {
    const component = renderer.create(<List list={list} />);
    expect(component.root.findAllByType(Item).length).toEqual(2);
  });
  test("renders snapshot", () => {
    const component = renderer.create(<List list={list} />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
describe("SearchForm", () => {
  const searchFormProps = {
    searchTerm: "React",
    onSearchInput: jest.fn(),
    onSearchSubmit: jest.fn(),
  };
  let component;
  beforeEach(() => {
    component = renderer.create(<SearchForm {...searchFormProps} />);
  });
  it("renders the input field with its value", () => {
    const value = component.root.findByType("input").props.value;
    expect(value).toEqual("React");
  });
  it("changes the input field", () => {
    const pseudoEvent = { target: "Redux" };
    component.root.findByType("input").props.onChange(pseudoEvent);
    expect(searchFormProps.onSearchInput).toHaveBeenCalledTimes(1);
    expect(searchFormProps.onSearchInput).toHaveBeenCalledWith(pseudoEvent);
  });
  it("submits the form", () => {
    const pseudoEvent = {};
    component.root.findByType("form").props.onSubmit(pseudoEvent);
    expect(searchFormProps.onSearchSubmit).toHaveBeenCalledTimes(1);
    expect(searchFormProps.onSearchSubmit).toHaveBeenCalledWith(pseudoEvent);
  });
  it("disables the button and prevents submit", () => {
    component.update(<SearchForm {...searchFormProps} searchTerm="" />);
    expect(component.root.findByType("button").props.disabled).toBeTruthy();
  });
  test("renders snapshot", () => {
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
describe("Separate Enzyme tests", () => {
  it("renders child InputWithLabel", () => {
    const wrapper = mount(<SearchForm />);
    expect(wrapper.find(InputWithLabel).length).toEqual(1);
  });
  it("renders child InputWithLabel with 'Search:' label", () => {
    const wrapper = mount(<SearchForm />);
    expect(wrapper.find("strong").text()).toEqual("Search:");
  });
});
describe("App", () => {
  it("renders child InputWithLabel and responds to new values", () => {
    const wrapper = mount(<App />);
    wrapper
      .find("input")
      .at(0)
      .simulate("change", { target: { value: "ReasonML" } });
    const InputWrapper = wrapper.find(InputWithLabel);
    expect(InputWrapper.find("input").prop("value")).toEqual("ReasonML");
  });
  it("succeeds fetching data with a list", async () => {
    const list = [
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
    const promise = Promise.resolve({
      data: {
        hits: list,
      },
    });
    axios.get.mockImplementationOnce(() => promise);
    let component;
    await renderer.act(async () => {
      component = renderer.create(<App />);
    });
    expect(component.root.findByType(List).props.list).toEqual(list);
  });
  it("fails fetching data with a list", async () => {
    const promise = Promise.reject();
    axios.get.mockImplementationOnce(() => promise);
    let component;
    await renderer.act(async () => {
      component = renderer.create(<App />);
    });
    expect(component.root.findByType("p").props.children).toEqual(
      "Something went wrong ..."
    );
  });
  it("renders snapshot", () => {
    let component = renderer.create(<App />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
  describe("storiesReducer", () => {
    const state = {
      data: [
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
      ],
      isLoading: false,
      isError: false,
    };
    it("should set fetch init", () => {
      const newState = storiesReducer(state, { type: "STORIES_FETCH_INIT" });
      expect(newState).toEqual({ ...state, isLoading: true, isError: false });
    });
    it("should set fetch error", () => {
      const newState = storiesReducer(state, { type: "STORIES_FETCH_FAILURE" });
      expect(newState).toEqual({ ...state, isLoading: false, isError: true });
    });
    it("should set fetch success", () => {
      const newState = storiesReducer(state, {
        type: "STORIES_FETCH_SUCCESS",
        payload: [
          {
            title: "React",
            url: "https://reactjs.org/",
            author: "Jordan Walke",
            num_comments: 3,
            points: 5,
            objectID: 0,
          },
          {
            title: "Redux",
            url: "https://redux.js.org/",
            author: "Dan Abramov, Andrew Clark",
            num_comments: 2,
            points: 6,
            objectID: 1,
          },
        ],
      });
      expect(newState).toEqual({
        data: [
          {
            title: "React",
            url: "https://reactjs.org/",
            author: "Jordan Walke",
            num_comments: 3,
            points: 5,
            objectID: 0,
          },
          {
            title: "Redux",
            url: "https://redux.js.org/",
            author: "Dan Abramov, Andrew Clark",
            num_comments: 2,
            points: 6,
            objectID: 1,
          },
        ],
        isLoading: false,
        isError: false,
      });
    });
    it("should remove a story", () => {
      const newState = storiesReducer(state, {
        type: "REMOVE_STORY",
        payload: {
          title: "React",
          url: "https://reactjs.org/",
          author: "Jordan Walke",
          num_comments: 3,
          points: 4,
          objectID: 0,
        },
      });
      expect(newState).toEqual({
        data: [
          {
            title: "Redux",
            url: "https://redux.js.org/",
            author: "Dan Abramov, Andrew Clark",
            num_comments: 2,
            points: 5,
            objectID: 1,
          },
        ],
        isLoading: false,
        isError: false,
      });
    });
  });
});
