import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as asyncActions from "./userAuth";
import * as status from "../../data/asyncStatus";

// Initial state
const initialState = {
  currentUser: null,
  status: status.IDLE,
  userStatus: status.IDLE,
  error: null,
};

// Async thunks
export const fetchUser = createAsyncThunk(
  "user/fetchUser",
  asyncActions.fetchUser
);

export const updateUser = createAsyncThunk(
  "user/updateUser",
  asyncActions.updateUser
);

export const updateUserProfileImg = createAsyncThunk(
  "user/updateUserProfileImg",
  asyncActions.updateUserProfileImg
);

export const registerUser = createAsyncThunk(
  "user/createUser",
  asyncActions.registerUser
);

export const loginGoogle = createAsyncThunk(
  "user/googleLogin",
  asyncActions.loginWithGoogle
);

export const loginWithForm = createAsyncThunk(
  "user/FormLogin",
  asyncActions.loginWithForm
);

export const logout = createAsyncThunk("user/logout", asyncActions.logout);

// Slice definition
export const authUserSlice = createSlice({
  name: "authUser",
  initialState,
  reducers: {
    removeAuthUser: (state) => {
      state.currentUser = null;
    },
    setUser: (state, action) => {
      state.currentUser = action.payload;
      state.status = status.SUCCEEDED;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Special cases for updateUser and updateUserProfileImg that use userStatus
      .addCase(updateUser.pending, (state) => {
        state.userStatus = status.LOADING;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, { payload: { user } }) => {
        state.userStatus = status.SUCCEEDED;
        state.error = null;
        state.currentUser = user;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.userStatus = status.FAILED;
        state.error = action.error.message;
        console.error(action.error.message);
      })
      .addCase(updateUserProfileImg.pending, (state) => {
        state.userStatus = status.LOADING;
        state.error = null;
      })
      .addCase(
        updateUserProfileImg.fulfilled,
        (state, { payload: { userImgUrl } }) => {
          state.userStatus = status.SUCCEEDED;
          state.error = null;
          state.currentUser.profilePic = userImgUrl;
        }
      )
      .addCase(updateUserProfileImg.rejected, (state, action) => {
        state.userStatus = status.FAILED;
        state.error = action.error.message;
        console.error(action.error.message);
      })
      // Special case for logout
      .addCase(logout.fulfilled, (state) => {
        state.currentUser = null;
        state.status = status.SUCCEEDED;
        state.error = null;
      })
      // Regular fulfilled cases that set currentUser
      .addCase(fetchUser.fulfilled, (state, { payload: { user } }) => {
        state.currentUser = user;
      })
      .addCase(registerUser.fulfilled, (state, { payload: { user } }) => {
        state.currentUser = user;
      })
      .addCase(loginGoogle.fulfilled, (state, { payload: { user } }) => {
        state.currentUser = user;
      })
      .addCase(loginWithForm.fulfilled, (state, { payload: { user } }) => {
        state.currentUser = user;
      })
      // Common matchers for regular status handling
      .addMatcher(
        (action) => {
          return (
            action.type.startsWith("user/") &&
            action.type.endsWith("/pending") &&
            !action.type.includes("updateUser")
          );
        },
        (state) => {
          state.status = status.LOADING;
          state.error = null;
        }
      )
      .addMatcher(
        (action) => {
          return (
            action.type.startsWith("user/") &&
            action.type.endsWith("/fulfilled") &&
            !action.type.includes("updateUser")
          );
        },
        (state) => {
          state.status = status.SUCCEEDED;
          state.error = null;
        }
      )
      .addMatcher(
        (action) => {
          return (
            action.type.startsWith("user/") &&
            action.type.endsWith("/rejected") &&
            !action.type.includes("updateUser")
          );
        },
        (state, action) => {
          state.status = status.FAILED;
          state.error = action.error.message;
          console.error(action.error.message);
        }
      );
  },
});

// Exports
export const { removeAuthUser, setUser } = authUserSlice.actions;
export default authUserSlice.reducer;
