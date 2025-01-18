import axios from "axios";
import API from "../../lib/authAxios";
import { subArrays } from "../../utilities/arrayUtil";

const GOOGLE_BOOKS_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

export const searchBooks = async (query, startIndex = 0) => {
  try {
    const res = await axios.get(
      `https://www.googleapis.com/books/v1/volumes?q=${query}&startIndex=${startIndex}&maxResults=${36}&key=${GOOGLE_BOOKS_API_KEY}`,
      {
        retry: 3,
        retryDelay: 1000,
        timeout: 5000,
      }
    );

    if (!res.data.items) {
      return { results: [], total: 0 };
    }

    const results = subArrays(res.data.items, 12);
    return { results, total: res.data.totalItems };
  } catch (error) {
    if (error.response?.status === 429) {
      throw new Error(
        "Rate limit exceeded. Please try again in a few moments."
      );
    }
    return Promise.reject(error);
  }
};

export const searchUsers = async (query) => {
  try {
    const res = await API.get(`user/search?user=${query}`);
    const results = subArrays(res.data, 12);
    return { results, total: res.data.length };
  } catch (error) {
    throw error;
  }
};
