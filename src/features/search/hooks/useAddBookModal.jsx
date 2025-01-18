import { useState } from "react";
import { Modal } from "../../../components";
import FormContainer from "../../library/components/ModalForms/Shared/FormContainer/FormContainer";
import { BaseForm } from "../../library/components/ModalForms/BookModalForm/BookModalForm";
import { useDispatch } from "react-redux";
import { addBook } from "../../library";

export const useAddBookModal = (user_id) => {
  const [modal, setModal] = useState({
    isOpen: false,
    data: null,
    label: null,
  });

  const dispatch = useDispatch();

  const openModal = (data) => {
    setModal({ isOpen: true, data });
  };

  const closeModal = () => {
    setModal({ isOpen: false, data: null });
  };

  const renderModal = () => {
    const bookData = { book: modal.data };
    return (
      <Modal isOpen={modal.isOpen} onClose={closeModal} title="Add Book">
        <FormContainer bookData={bookData} label="Add Book to library">
          <BaseForm
            confirmationMsg="Add book to library"
            successMessage="Book was added to library"
            buttonText="Add"
            loadingText="Adding..."
            onConfirm={() =>
              dispatch(addBook({ id: user_id, bookDto: modal.data }))
            }
            onClose={closeModal}
          />
        </FormContainer>
      </Modal>
    );
  };

  return {
    openModal,
    renderModal,
  };
};
