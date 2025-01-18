import axios from "../../lib/authAxios";

export const requestFriend = async (person_id) => {
  try {
    const res = await axios.post(`friends/request/${person_id}`);
    return res.data;
  } catch (error) {
    throw (
      error.response?.data?.message ||
      error.message ||
      "Failed to send friend request"
    );
  }
};

export const addFriendFromRequest = async (request_id) => {
  try {
    const res = await axios.post(`friends/add/${request_id}`);
    return res.data;
  } catch (error) {
    throw (
      error.response?.data?.message || error.message || "Failed to add friend"
    );
  }
};

export const getUserData = async ({ user_id }) => {
  try {
    const res = await axios.get(`user/${user_id}`);
    return res.data;
  } catch (error) {
    throw (
      error.response?.data?.message ||
      error.message ||
      "Failed to get user data"
    );
  }
};

export const removeFriend = async (friend_id) => {
  try {
    const res = await axios.delete(`friends/remove/${friend_id}`);
    return res.data;
  } catch (error) {
    throw (
      error.response?.data?.message ||
      error.message ||
      "Failed to remove friend"
    );
  }
};
