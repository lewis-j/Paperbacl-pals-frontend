import React, { useState } from "react";
import { Modal } from "../../../../components";
import { BookModalContent } from "../../../library/config/modals/menuModalOptions";
import { MODAL_TYPES as BOOK_MODAL_TYPES } from "../../../library/config/modals";
import { MODAL_TYPES as FRIEND_MODAL_TYPES } from "../../../Friends/hooks/friendModalTypesAndActions";
import { useModalActions as useNotificationModalActions } from "../../../library/hooks/useModalActions";
import { createBookFromRequestFinder } from "../../../library/userBooksSlice";
import { useSelector } from "react-redux";
import { runBookRequestAction } from "../../../library/utilities/bookRequestAction";
import { FriendModalContent } from "../../../Friends/config/friendsMenuModalOptions";
import { useFriendModalActions } from "../../../Friends/hooks/friendModalTypesAndActions";

const useNotificationModal = (notifications) => {
  const [modal, setModal] = useState({
    isOpen: false,
    type: null,
    title: null,
    data: null,
  });
  const [requestType, setRequestType] = useState(null);

  const findBookFromRequest = useSelector(createBookFromRequestFinder);

  const closeModal = () => {
    setModal({ isOpen: false, type: null, title: null, data: null });
  };

  const openModal = (type, data) => {
    console.log("openModal", type, data);
    const config = BOOK_MODAL_TYPES[type] || FRIEND_MODAL_TYPES[type];
    console.log("config", config);
    if (!config) {
      console.warn(`No configuration found for modal type: ${type}`);
      return;
    }
    setModal({ isOpen: true, type: config.value, title: config.title, data });
  };

  const notificationModalActions = useNotificationModalActions(openModal);
  const friendModalActions = useFriendModalActions(openModal);

  const openNotificationModal = async (notification_id) => {
    console.log("openNotificationModal", notifications);
    const notification = notifications.find(
      (notification) => notification._id === notification_id
    );
    if (!notification) return;
    console.log("openNotificationModal", notification);
    if (notification.requestType === "BookRequest") {
      setRequestType("BookRequest");
      const userBook = findBookFromRequest(notification.requestRef._id);
      console.log("userBook", userBook);
      return runBookRequestAction(notificationModalActions, userBook);
    } else if (notification.requestType === "FriendRequest") {
      setRequestType("FriendRequest");
      console.log("acceptFriendRequest", notification);
      friendModalActions.acceptFriendRequest({
        ...notification.user,
        request_id: notification.requestRef._id,
      });
    }
  };

  const getModalContent = (modal) => {
    console.log("getModalContent", modal);
    if (!modal?.data) return null;
    if (requestType === "BookRequest") {
      return <BookModalContent modal={modal} onClose={closeModal} />;
    } else if (requestType === "FriendRequest") {
      console.log("FriendRequest modal content", modal);
      return <FriendModalContent modal={modal} onClose={closeModal} />;
    }
  };

  const renderModal = () => {
    return (
      <Modal isOpen={modal.isOpen} onClose={closeModal} title={modal.title}>
        {getModalContent(modal)}
      </Modal>
    );
  };

  return { renderModal, openNotificationModal };
};

export default useNotificationModal;
