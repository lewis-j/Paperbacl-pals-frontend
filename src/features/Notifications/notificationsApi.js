import API from "../../lib/authAxios";

export const createNotifications = async ({
  recipient_id,
  notificationDto,
}) => {
  try {
    const res = await API.post(
      `notifications/new/${recipient_id}`,
      notificationDto
    );

    return { notification: res.data };
  } catch (error) {
    return Promise.reject(error);
  }
};

export const fetchNotifications = async () => {
  try {
    const res = await API.get(`notifications`);

    return { notifications: res.data };
  } catch (error) {
    return Promise.reject(error);
  }
};

export const markAsRead = async (notification_id) => {
  try {
    const res = await API.put(`notifications/isRead/${notification_id}`);

    const { notification } = res.data;
    return { notification };
  } catch (error) {
    return Promise.reject(error);
  }
};

export const markAllAsRead = async () => {
  try {
    const res = await API.put(`notifications/markAllAsRead`);
    const { notification } = res.data;
    return { notification };
  } catch (error) {
    return Promise.reject(error);
  }
};
