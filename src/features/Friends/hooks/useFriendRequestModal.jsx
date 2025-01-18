import { useState } from "react";
import {
  MODAL_TYPES,
  useFriendModalActions,
} from "./friendModalTypesAndActions";
import { Modal } from "../../../components";
import { FriendModalContent } from "../config/friendsMenuModalOptions";

export const useFriendRequestModal = () => {
  const [modal, setModal] = useState({
    isOpen: false,
    type: null,
    title: null,
    data: null,
  });
  const closeModal = () => {
    setModal({ isOpen: false, type: null, title: null, data: null });
  };

  const openModal = (type, data) => {
    const config = MODAL_TYPES[type];
    if (!config) {
      console.warn(`No configuration found for modal type: ${type}`);
      return;
    }
    setModal({ isOpen: true, type: config.value, title: config.title, data });
  };

  const friendModalActions = useFriendModalActions(openModal);

  const renderModal = () => {
    if (!modal.isOpen) return null;
    console.log(modal);
    return (
      <Modal isOpen={modal.isOpen} onClose={closeModal} title={modal.title}>
        <FriendModalContent modal={modal} onClose={closeModal} />
      </Modal>
    );
  };

  return { renderModal, friendModalActions };
};
