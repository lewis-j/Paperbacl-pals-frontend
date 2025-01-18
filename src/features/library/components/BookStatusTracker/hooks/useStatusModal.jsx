import React, { useState } from "react";
import { Modal } from "../../../../../components";
import { StatusModalContent } from "../components/StatusModalContent";

export const useStatusModal = () => {
  const [modal, setModal] = useState({ isOpen: false, data: null });

  const openModal = ({ img: imageUrl, label, timestamp, icon: Icon }) => {
    setModal({
      isOpen: true,
      data: { imageUrl, label, timestamp, Icon },
    });
  };

  const closeModal = () => {
    setModal({ isOpen: false, data: null });
  };

  const renderStatusModal = () => {
    if (!modal.isOpen) return null;

    const { imageUrl, label, timestamp, Icon } = modal.data;

    return (
      <Modal isOpen={modal.isOpen} onClose={closeModal}>
        <StatusModalContent
          imageUrl={imageUrl}
          label={label}
          timestamp={timestamp}
          Icon={Icon}
        />
      </Modal>
    );
  };

  return { openModal, renderStatusModal };
};
