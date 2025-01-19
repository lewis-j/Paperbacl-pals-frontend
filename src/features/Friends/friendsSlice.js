import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as status from "../../data/asyncStatus";
import * as friendsThunks from "./friendsThunks";

const sendFriendRequest = createAsyncThunk(
  "friends/sendFriendRequest",
  friendsThunks.requestFriend
);

const sendFriendRequestFullfilled = (
  state,
  { payload: { newFriendRequest } }
) => {
  console.log("sendFriendRequestFullfilled", newFriendRequest);
  state.friendRequestOutbox = [...state.friendRequestOutbox, newFriendRequest];
};

const acceptFriendRequest = createAsyncThunk(
  "friends/acceptFriendRequest",
  friendsThunks.addFriendFromRequest
);

const acceptFriendRequestFullfilled = (
  state,
  { payload: { friend, request_id } }
) => {
  console.table({ request_id, friend });

  state.friendsList.push(friend);
  state.friendRequestInbox = state.friendRequestInbox.filter(
    ({ _id }) => _id !== request_id
  );
};
const getFriendsUserData = createAsyncThunk(
  "friends/getUserData",
  friendsThunks.getUserData
);

const getFriendsUserDataFullfilled = (state, { payload }) => {
  state.currentFriend = payload;
};

const removeFriend = createAsyncThunk(
  "friends/removeFriend",
  friendsThunks.removeFriend
);

const removeFriendFullfilled = (state, { payload }) => {
  state.friendsList = state.friendsList.filter(
    (friend) => friend._id !== payload
  );
};

const initialState = {
  currentFriend: null,
  friendsList: [],
  friendRequestOutbox: [],
  friendRequestInbox: [],
  status: status.IDLE,
  error: null,
};

export const friendsSlice = createSlice({
  name: "friends",
  initialState,
  reducers: {
    setCurrentFriend: (state, action) => {
      state.currentFriend = action.payload;
    },
    addRequestToCurrentFriend: (state, { payload }) => {
      const { userRequest_id, userBook_id } = payload;

      const newRequest = state.currentFriend?.ownedBooks.map((userBook) =>
        userBook._id === userBook_id
          ? { ...userBook, request: [...userBook.request, userRequest_id] }
          : userBook
      );
      state.currentFriend = {
        ...state.currentFriend,
        ownedBooks: [...newRequest],
      };
    },
    setFriends: (state, action) => {
      state.friendsList = action.payload.friends;
    },
    setFriendRequestInbox: (state, action) => {
      state.friendRequestInbox = action.payload.friendRequestInbox;
    },
    setFriendRequestOutbox: (state, action) => {
      state.friendRequestOutbox = action.payload.friendRequestOutbox;
    },
    updateFriendsBookRequests: (state, { payload }) => {
      const {
        currentFriend: { ownedBooks },
      } = state;
      const { bookRequest, userBook_id } = payload;
      const bookIndex = ownedBooks.findIndex(
        (userBook) => userBook._id === userBook_id
      );
      const _userBook = ownedBooks[bookIndex];
      ownedBooks[bookIndex] = {
        ..._userBook,
        requests: [
          ..._userBook.requests,
          {
            _id: bookRequest.request.request_id,
            status: bookRequest.request.status,
            dueDate: bookRequest.dueDate,
            currentPage: bookRequest.currentPage,
            sender: { _id: bookRequest.request.sender },
          },
        ],
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendFriendRequest.fulfilled, sendFriendRequestFullfilled)
      .addCase(acceptFriendRequest.fulfilled, acceptFriendRequestFullfilled)
      .addCase(getFriendsUserData.fulfilled, getFriendsUserDataFullfilled)
      .addCase(removeFriend.fulfilled, removeFriendFullfilled)
      // Add matchers for common status handling
      .addMatcher(
        (action) =>
          action.type.startsWith("friends/") &&
          action.type.endsWith("/pending"),
        (state) => {
          state.status = status.LOADING;
          state.error = null;
        }
      )
      .addMatcher(
        (action) =>
          action.type.startsWith("friends/") &&
          action.type.endsWith("/fulfilled"),
        (state) => {
          state.status = status.SUCCEEDED;
          state.error = null;
        }
      )
      .addMatcher(
        (action) =>
          action.type.startsWith("friends/") &&
          action.type.endsWith("/rejected"),
        (state, action) => {
          state.status = status.FAILED;
          state.error = action.error.message;
          console.error(action.error.message);
        }
      );
  },
});

export const getFriendsOwnedBookById = (book_id) => (state) =>
  state.friends.currentFriend.ownedBooks.find(({ _id }) => _id === book_id);

export const {
  setCurrentFriend,
  setFriends,
  setFriendRequestInbox,
  setFriendRequestOutbox,
  addRequestToCurrentFriend,
  updateFriendsBookRequests,
} = friendsSlice.actions;

export {
  sendFriendRequest,
  acceptFriendRequest,
  getFriendsUserData,
  removeFriend,
};

export default friendsSlice.reducer;
