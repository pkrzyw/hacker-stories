import Axios from "axios";

export const getStories = async (url) => {
  const result = await Axios.get(url);
  return result;
};
