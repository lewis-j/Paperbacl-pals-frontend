import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as status from "../../data/asyncStatus";
import { setExtraReducer } from "../../utilities/reduxUtil";
import * as notificationsApi from "./notificationsApi";
import { FRIEND_REQUEST_STATUS } from "../../data/friendRequestStatus";

const fetchNotifications = createAsyncThunk(
  "notifications/fetch",
  notificationsApi.fetchNotifications
);

const fetchNotificationsSuccess = (state, action) => {
  state.list = action.payload.notifications;
};

const markAsRead = createAsyncThunk(
  "notification/markAsRead",
  notificationsApi.markAsRead
);

const markAsReadSuccess = (state, action) => {
  const { notification } = action.payload;

  const notificationList = state.list;
  const idx = notificationList.findIndex(
    (_notification) => _notification._id === notification._id
  );

  state.list[idx] = notification;
};
const markAllAsRead = createAsyncThunk(
  "notification/markAllAsRead",
  notificationsApi.markAllAsRead
);

const markAllAsReadSuccess = (state, action) => {
  state.list = state.list.map((notification) => ({
    ...notification,
    isRead: true,
  }));
};

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
  extraReducers: {
    ...setExtraReducer(fetchNotifications, fetchNotificationsSuccess),
    ...setExtraReducer(markAsRead, markAsReadSuccess),
    ...setExtraReducer(markAllAsRead, markAllAsReadSuccess),
  },
});

export { fetchNotifications, markAsRead, markAllAsRead };

export const { setNotifications, addNotification, setNotificationsIsOpen } =
  notificationsSlice.actions;

export const selectNotificationByRequestRefIdCreator =
  (state) => (requestRefId, status) => {
    const notifications = state.notifications.list.filter(
      (notification) => notification.requestRef?._id === requestRefId
    );
    console.log("status", status);
    console.log("notifications", notifications);
    const notification = notifications.find(
      (notification) => notification.status === status
    );
    console.log("notification", notification);
    if (!notification?._id) {
      console.warn(`No notification found for requestRefId: ${requestRefId}`);
      return null;
    }
    return notification;
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
