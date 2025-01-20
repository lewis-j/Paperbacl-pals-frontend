import { useSelector } from "react-redux";
import { useBookActions } from "../../../hooks/useBookActions";
import FormContainer from "../Shared/FormContainer/FormContainer";
import { getModalConfig } from "../../../config/modals/menuModalOptions";
import * as asyncStatus from "../../../../../data/asyncStatus";

// Modal content component
const BookModalContent = ({ modal, onClose }) => {
  const actions = useBookActions();
  const status = useSelector((state) => state.userBooks.status);
  const error = useSelector((state) => state.userBooks.error);
  const isSubmitting = status === asyncStatus.LOADING;

  const config = getModalConfig(
    modal.type,
    modal.data,
    actions,
    isSubmitting,
    error,
    onClose
  );

  // Defensive rendering
  if (!config) {
    return null;
  }

  // If standalone component, render without FormContainer
  if (config.standalone) {
    return config.component;
  }

  console.log("modal.data", modal.data);

  return (
    <FormContainer bookData={modal.data.userBook}>
      {config.component}
    </FormContainer>
  );
};

export default BookModalContent;
