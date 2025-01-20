import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from "@reduxjs/toolkit";
import * as status from "../../data/asyncStatus";
import * as notificationsApi from "./notificationsApi";
import { FRIEND_REQUEST_STATUS } from "../../data/friendRequestStatus";

const fetchNotifications = createAsyncThunk(
  "notifications/fetch",
  notificationsApi.fetchNotifications
);

const markAsRead = createAsyncThunk(
  "notification/markAsRead",
  notificationsApi.markAsRead
);

const markAllAsRead = createAsyncThunk(
  "notification/markAllAsRead",
  notificationsApi.markAllAsRead
);

export const notificationsSlice = createSlice({
  name: "notifications",
  initialState: {
    list: [],
    status: status.IDLE,
    isOpen: false,
    error: null,
  },
  reducers: {
    setNotificationsIsOpen: (state, action) => {
      state.isOpen = action.payload;
    },
    setNotifications: (state, action) => {
      state.list = action.payload.notifications;
    },
    addNotification: (state, action) => {
      state.list.unshift(action.payload.notification);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.list = action.payload.notifications;
      })
      .addCase(markAsRead.fulfilled, (state, action) => {
        const { notification } = action.payload;
        const idx = state.list.findIndex(
          (_notification) => _notification._id === notification._id
        );
        state.list[idx] = notification;
      })
      .addCase(markAllAsRead.fulfilled, (state) => {
        state.list = state.list.map((notification) => ({
          ...notification,
          isRead: true,
        }));
      })
      .addMatcher(
        (action) =>
          action.type.startsWith("notification/") &&
          action.type.endsWith("/pending"),
        (state) => {
          state.status = status.LOADING;
          state.error = null;
        }
      )
      .addMatcher(
        (action) =>
          action.type.startsWith("notification/") &&
          action.type.endsWith("/fulfilled"),
        (state) => {
          state.status = status.SUCCEEDED;
          state.error = null;
        }
      )
      .addMatcher(
        (action) =>
          action.type.startsWith("notification/") &&
          action.type.endsWith("/rejected"),
        (state, action) => {
          state.status = status.FAILED;
          state.error = action.error.message;
          console.error(action.error.message);
        }
      );
  },
});

export { fetchNotifications, markAsRead, markAllAsRead };

export const { setNotifications, addNotification, setNotificationsIsOpen } =
  notificationsSlice.actions;

export const selectNotificationByRequestRefIdCreator = () => {
  // Memoize the inner selector using createSelector
  return createSelector(
    [
      (state) => state.notifications.list,
      (_, requestRefId) => requestRefId,
      (_, __, status) => status,
    ],
    (notifications, requestRefId, status) => {
      const filteredNotifications = notifications.filter(
        (notification) => notification.requestRef?._id === requestRefId
      );
      console.log("status", status);
      console.log("notifications", filteredNotifications);
      const notification = filteredNotifications.find(
        (notification) => notification.status === status
      );
      console.log("notification", notification);
      if (!notification?._id) {
        console.warn(`No notification found for requestRefId: ${requestRefId}`);
        return null;
      }
      return notification;
    }
  );
};

export const findPendingFriendRequestNotificationCreator =
  (state) => (requestRefId) => {
    console.log("requestRefId", requestRefId);
    const notifications = state.notifications.list.filter(
      (notification) => notification.requestRef._id === requestRefId
    );
    console.log("notifications", notifications);

    if (notifications.length === 0) {
      console.warn(`No notifications found for requestRefId: ${requestRefId}`);
      return null;
    }
    const pendingNotification = notifications.find(
      (notification) =>
        notification.requestRef.status === FRIEND_REQUEST_STATUS.PENDING
    );
    return pendingNotification._id;
  };
export default notificationsSlice.reducer;
