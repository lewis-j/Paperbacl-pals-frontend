import { useState } from "react";

import { BookModalContent } from "../../../config/modals/menuModalOptions";

import { runBookRequestAction } from "../../../utilities/bookRequestAction";
import { useModalActions } from "../../../hooks/useModalActions";
import { Modal } from "../../../../../components";
import { MODAL_TYPES } from "../../../config/modals/modalTypes";

export const useBookTransferModal = (isBorrower) => {
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

  const modalActions = useModalActions(openModal);

  const runAction = (userBook) =>
    runBookRequestAction(modalActions, { ...userBook, isOwned: !isBorrower });

  const getModalContent = (modal) => {
    if (!modal?.data) return null;
    return <BookModalContent modal={modal} onClose={closeModal} />;
  };

  const renderModal = () => {
    return (
      <Modal isOpen={modal.isOpen} onClose={closeModal} title={modal.title}>
        {getModalContent(modal)}
      </Modal>
    );
  };

  return { renderModal, runAction };
};
