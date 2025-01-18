import { addNotification } from "../Notifications";
import * as API from "./friendsApi";

export const requestFriend = async ({ friend_id }, { dispatch }) => {
  try {
    const { notification, newFriendRequest } = await API.requestFriend(
      friend_id
    );
    console.log("requestFriend newFriendRequest", newFriendRequest);
    console.log("requestFriend notification", notification);
    dispatch(addNotification({ notification }));
    return { newFriendRequest };
  } catch (error) {
    return Promise.reject(error);
  }
};

export const addFriendFromRequest = async ({ request_id }, { dispatch }) => {
  console.log("addFriendFromRequest request_id", request_id);
  try {
    const { notification, friend } = await API.addFriendFromRequest(request_id);
    dispatch(addNotification({ notification }));
    return { friend, request_id };
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getUserData = async ({ user_id }) => {
  try {
    return await API.getUserData({ user_id });
  } catch (error) {
    return Promise.reject(error);
  }
};

export const removeFriend = async ({ friend_id }) => {
  try {
    return await API.removeFriend(friend_id);
  } catch (error) {
    return Promise.reject(error);
  }
};
