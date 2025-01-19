import { configureStore } from "@reduxjs/toolkit";
import userBooksReducer from "../features/library/userBooksSlice";
import authUserSlice from "../features/Authentication/authUserSlice";
import friendsSlice from "../features/Friends/friendsSlice";
import searchResultsSlice from "../features/search/searchResultsSlice";
import { logger } from "redux-logger";
import notificationsSlice from "../features/Notifications/notificationsSlice";
import chatSlice from "../features/Chat/chatSlice";
import ratingsSlice from "../features/Ratings/RatingsSlice";

export const store = configureStore({
  reducer: {
    userBooks: userBooksReducer,
    authUser: authUserSlice,
    friends: friendsSlice,
    searchResults: searchResultsSlice,
    notifications: notificationsSlice,
    chat: chatSlice,
    bookRatings: ratingsSlice,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});
