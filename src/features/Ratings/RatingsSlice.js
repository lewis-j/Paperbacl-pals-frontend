import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as ratingsThunks from "./RatingsThunks";
import * as status from "../../data/asyncStatus";

export const getUsersBookRatings = createAsyncThunk(
  "ratings/getUsersBookRatings",
  ratingsThunks.getUsersBookRatings
);

export const rateBook = createAsyncThunk(
  "ratings/rateBook",
  ratingsThunks.rateBook
);

export const updateRating = createAsyncThunk(
  "ratings/updateRating",
  ratingsThunks.updateRating
);

export const ratingsSlice = createSlice({
  name: "ratings",
  initialState: {
    ratings: [],
    status: status.IDLE,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUsersBookRatings.fulfilled, (state, { payload }) => {
        state.ratings = payload;
      })
      .addCase(rateBook.fulfilled, (state, { payload }) => {
        // Add the new rating to the ratings array
        state.ratings.push(payload.rating);
      })
      .addCase(updateRating.fulfilled, (state, { payload }) => {
        const index = state.ratings.findIndex((r) => r._id === payload._id);
        if (index !== -1) {
          state.ratings[index] = payload;
        }
      })
      // Common matchers for status handling
      .addMatcher(
        (action) =>
          action.type.startsWith("ratings/") &&
          action.type.endsWith("/pending"),
        (state) => {
          state.status = status.LOADING;
          state.error = null;
        }
      )
      .addMatcher(
        (action) =>
          action.type.startsWith("ratings/") &&
          action.type.endsWith("/fulfilled"),
        (state) => {
          state.status = status.SUCCEEDED;
          state.error = null;
        }
      )
      .addMatcher(
        (action) =>
          action.type.startsWith("ratings/") &&
          action.type.endsWith("/rejected"),
        (state, action) => {
          state.status = status.FAILED;
          state.error = action.error.message;
          console.error(action.error.message);
        }
      );
  },
});

export const selectUserRatingForBook = (state, bookId) =>
  state.bookRatings.ratings.find((rating) => rating.book === bookId);

export default ratingsSlice.reducer;
