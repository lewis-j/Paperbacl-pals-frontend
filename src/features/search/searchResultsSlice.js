import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as searchApi from "./searchApi";
import * as status from "../../data/asyncStatus";

export const searchBooks = createAsyncThunk(
  "searchResults/searchBooks",
  ({ query }) => {
    return searchApi.searchBooks(query);
  }
);

export const getMoreBooks = createAsyncThunk(
  "searchResults/getBooks",
  async ({ startIndex }, { getState }) => {
    const state = getState();
    const query = state.searchResults.query;
    try {
      return await searchApi.searchBooks(query, startIndex);
    } catch (error) {
      return Promise.reject(error);
    }
  }
);

export const searchUsers = createAsyncThunk(
  "searchResults/searchUsers",
  async ({ query }, { rejectWithValue }) => {
    try {
      return await searchApi.searchUsers(query);
    } catch (error) {
      if (error?.response?.data)
        return rejectWithValue({ ...error.response.data });
      return Promise.reject(error);
    }
  }
);

export const searchResultSlice = createSlice({
  name: "searchResults",
  initialState: {
    query: "",
    bookResults: { results: [] },
    userResults: { results: [] },
    status: status.IDLE,
    error: null,
  },
  reducers: {
    setQuery: (state, action) => {
      state.query = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Search Books cases
      .addCase(searchBooks.fulfilled, (state, { payload }) => {
        state.bookResults.results = payload?.results || [];
        state.bookResults.total = payload.total;
      })
      // Get More Books cases
      .addCase(getMoreBooks.fulfilled, (state, { payload }) => {
        state.bookResults.results = [
          ...state.bookResults.results,
          ...payload.results,
        ];
      })
      // Search Users cases
      .addCase(searchUsers.fulfilled, (state, { payload }) => {
        state.userResults.results = payload?.results || [];
        state.userResults.total = payload.total;
      })
      .addCase(searchUsers.rejected, (state, action) => {
        state.status = status.FAILED;
        state.error = action.payload || action.error.message;
        console.error(action.error.message);
      })
      // Common matchers for status handling
      .addMatcher(
        (action) =>
          action.type.startsWith("searchResults/") &&
          action.type.endsWith("/pending"),
        (state) => {
          state.status = status.LOADING;
          state.error = null;
        }
      )
      .addMatcher(
        (action) =>
          action.type.startsWith("searchResults/") &&
          action.type.endsWith("/fulfilled"),
        (state) => {
          state.status = status.SUCCEEDED;
          state.error = null;
        }
      )
      .addMatcher(
        (action) =>
          action.type.startsWith("searchResults/") &&
          action.type.endsWith("/rejected") &&
          !action.type.includes("searchUsers"),
        (state, action) => {
          state.status = status.FAILED;
          state.error = action.error.message;
          console.error(action.error.message);
        }
      );
  },
});

export { status as condition };
export const { setQuery } = searchResultSlice.actions;

export default searchResultSlice.reducer;
