import {
  createAsyncThunk,
  createSlice,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import * as ratingsThunks from "./RatingsThunks";
import * as status from "../../data/asyncStatus";

// Create the adapter
const ratingsAdapter = createEntityAdapter({
  selectId: (rating) => rating._id,
});

// Create the initial state using the adapter
const initialState = ratingsAdapter.getInitialState({
  bookRatings: {},
  status: status.IDLE,
  error: null,
});

export const getUsersBookRatings = createAsyncThunk(
  "ratings/getUsersBookRatings",
  ratingsThunks.getUsersBookRatings
);

export const getBookRatings = createAsyncThunk(
  "ratings/getBookRatings",
  ratingsThunks.getBookRatings
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
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUsersBookRatings.fulfilled, (state, { payload }) => {
        ratingsAdapter.setAll(state, payload);
      })
      .addCase(rateBook.fulfilled, (state, { payload }) => {
        ratingsAdapter.addOne(state, payload.rating);
      })
      .addCase(updateRating.fulfilled, (state, { payload }) => {
        ratingsAdapter.upsertOne(state, payload.rating);
      })
      .addCase(getBookRatings.fulfilled, (state, { payload }) => {
        state.bookRatings[payload.bookId] = payload.ratings;
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

// Export the generated selectors
export const {
  selectAll: selectAllRatings,
  selectById: selectRatingById,
  selectIds: selectRatingIds,
} = ratingsAdapter.getSelectors((state) => {
  // Add a safety check to handle undefined state
  return state?.bookRatings ?? initialState;
});

// Update the custom selector with safety checks
export const selectUserRatingForBook = (state, bookId) => {
  if (!state?.bookRatings || !bookId) return null;
  const rating = selectAllRatings(state);
  return rating.find((rating) => rating?.book?._id === bookId);
};

export const selectBookRatings = (state, bookId) => {
  if (!state?.bookRatings?.bookRatings || !bookId) return [];
  return state.bookRatings.bookRatings[bookId] || [];
};

export default ratingsSlice.reducer;
