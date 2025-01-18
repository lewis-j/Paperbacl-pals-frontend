import { useState } from "react";
import { Modal } from "../../../components";
import { ModalContext } from "../../../context/ModalContext";
import { useModalActions } from "../../../features/library/hooks/useModalActions";
import { BookModalContent } from "../config/modals/menuModalOptions";
import { MODAL_TYPES } from "../config/modals/modalTypes";
import { getMenuItems } from "../config/modals/menuItems";

export const useModalMenu = (setActiveCardId) => {
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
  const modalActions = useModalActions(openModal);

  const closeModal = () => {
    setModal({ isOpen: false, type: null, title: null, data: null });
    setActiveCardId("");
  };

  const menuItems = getMenuItems(modalActions);

  const renderModal = () => {
    return (
      <ModalContext.Provider value={{ openModal: modalActions.openModal }}>
        <Modal isOpen={modal.isOpen} onClose={closeModal} title={modal.title}>
          <BookModalContent modal={modal} onClose={closeModal} />
        </Modal>
      </ModalContext.Provider>
    );
  };

  return {
    menuItems,
    renderModal,
  };
};
