import { useState } from "react";
import { Modal } from "../../../components";
import { ModalContext } from "../../../context/ModalContext";
import { useModalActions } from "../../../features/library/hooks/useModalActions";
import { BookModalContent } from "../config/modals/menuModalOptions";
import { MODAL_TYPES } from "../config/modals/modalTypes";
import { getMenuItems } from "../config/modals/menuItems";
import { runBookRequestAction } from "../utilities/bookRequestAction";

export const useLibraryModalManager = (setActiveCardId = () => {}) => {
  const [modal, setModal] = useState({
    isOpen: false,
    type: null,
    title: null,
    data: null,
  });

  const openModal = (type, data) => {
    const config = MODAL_TYPES[type];
    if (!config) {
      console.warn(`No configuration found for modal type: ${type}`);
      return;
    }
    setModal({ isOpen: true, type: config.value, title: config.title, data });
  };

  const closeModal = () => {
    setModal({ isOpen: false, type: null, title: null, data: null });
    if (setActiveCardId) {
      setActiveCardId("");
    }
  };

  const modalActions = useModalActions(openModal);
  const menuItems = getMenuItems(modalActions);

  const runAction = (isBorrower) => (userBook) =>
    runBookRequestAction(modalActions, { ...userBook, isOwned: !isBorrower });

  const getModalContent = (modal) => {
    if (!modal?.data) return null;
    return <BookModalContent modal={modal} onClose={closeModal} />;
  };

  const renderModal = () => {
    return (
      <ModalContext.Provider value={{ openModal: modalActions.openModal }}>
        <Modal isOpen={modal.isOpen} onClose={closeModal} title={modal.title}>
          {getModalContent(modal)}
        </Modal>
      </ModalContext.Provider>
    );
  };

  return {
    menuItems,
    renderModal,
    runAction,
    modalActions,
  };
};
