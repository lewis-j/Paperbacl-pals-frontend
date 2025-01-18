import { useSelector } from "react-redux";
import { BaseForm } from "../../components/ModalForms/BookModalForm/BookModalForm";
import BookModalForm from "../../components/ModalForms/BookModalForm/BookModalForm";
import FormContainer from "../../components/ModalForms/Shared/FormContainer/FormContainer";
import { useBookActions } from "../../hooks/useBookActions";
import { MODAL_TYPES } from "./modalTypes";
import * as asyncStatus from "../../../../data/asyncStatus";
import { BookStatusTracker } from "../../components";

const createFormModal = (label, Component, props) => ({
  label,
  component: <Component {...props} />,
});

const getModalConfig = (
  type,
  modalData,
  actions,
  isSubmitting,
  error,
  onClose
) => {
  const { userBook } = modalData;
  console.log("userBook", userBook);
  const commonProps = {
    userBook,
    onClose,
    isSubmitting,
    error,
  };

  switch (type) {
    // Book Reading Progress
    case MODAL_TYPES.VIEW_BOOK_DETAILS.value:
      return {
        label: "Book Description",
        component: (
          <BookModalForm.BookDetailsView
            userBook={userBook}
            onClose={onClose}
          />
        ),
        standalone: true,
      };
    case MODAL_TYPES.VIEW_TRANSFER_HISTORY.value:
      return {
        label: "Transfer History",
        component: (
          <BookStatusTracker
            userBook={userBook}
            isColumn={true}
            isBorrower={userBook.isBorrower}
          />
        ),
        standalone: true,
      };

    case MODAL_TYPES.UPDATE_PAGE_COUNT.value:
      return createFormModal(
        "Update current page",
        BookModalForm.UpdatePageForm,
        {
          ...commonProps,
          onUpdateProgress: actions.updateReadingProgress,
        }
      );

    case MODAL_TYPES.SET_CURRENT_READ.value:
      return createFormModal("Set Current Read", BaseForm, {
        ...commonProps,
        confirmationMsg: `Set current read to ${userBook.book.title}?`,
        buttonText: "Set Current Read",
        loadingText: "Setting Current Read...",
        successMessage: `${userBook.book.title} has been set as your current read!`,
        onConfirm: () => actions.setCurrentRead(userBook._id),
      });

    case MODAL_TYPES.COMPLETE_BOOK.value:
      return createFormModal("Mark book as complete", BaseForm, {
        ...commonProps,
        confirmationMsg: `This will update your progress to ${userBook.book.pageCount} pages, marking the book as complete.`,
        buttonText: "Mark Complete",
        loadingText: "Updating Progress...",
        successMessage: `Congratulations! You've completed ${userBook.book.title}!`,
        onConfirm: () =>
          actions.completeBook(
            userBook.request._id,
            userBook._id,
            userBook.book.pageCount
          ),
      });

    // Borrow Request Flow
    case MODAL_TYPES.VIEW_BORROW_REQUESTS.value:
      return createFormModal(
        "Borrow Requests",
        BookModalForm.BorrowRequestsList,
        {
          ...commonProps,
        }
      );

    case MODAL_TYPES.CREATE_BORROW_REQUEST.value:
      return createFormModal("Create Borrow Request", BaseForm, {
        ...commonProps,
        confirmationMsg: `Would you like to request to borrow "${userBook.book.title}" from ${userBook.owner.username}?`,
        buttonText: "Send Borrow Request",
        loadingText: "Sending Request...",
        successMessage: `Borrow request for "${userBook.book.title}" has been sent to ${userBook.owner.username}!`,
        onConfirm: () => actions.createBorrowRequest(userBook._id),
      });

    case MODAL_TYPES.CONFIRM_BORROW_REQUEST.value:
      return createFormModal(
        "Confirm Borrow Request",
        BookModalForm.ConfirmBorrowRequestForm,
        {
          ...commonProps,
          confirmationMsg: `Do you want to lend "${userBook.book.title}" to ${userBook.sender.username}?`,
          buttonText: "Accept",
          secondaryButtonText: "Decline",
          loadingText: "Accepting...",
          secondaryLoadingText: "Declining...",
          successMessage: `You've accepted the request to lend "${userBook.book.title}" to ${userBook.sender.username}!`,
          secondarySuccessMessage: `You've declined the request to lend "${userBook.book.title}" to ${userBook.sender.username}`,
          onConfirm: (pictureRequired) =>
            actions.confirmBorrowRequest(userBook.request._id, pictureRequired),
          onSecondaryAction: () =>
            actions.declineLendingRequest(userBook.request._id),
        }
      );
    case MODAL_TYPES.DECLINE_LENDING_REQUEST.value:
      return createFormModal("Decline Lending Request", BaseForm, {
        ...commonProps,
        confirmationMsg: `Are you sure you want to decline the lending request for "${userBook.book.title}" from ${userBook.sender.username}?`,
        buttonText: "Decline Request",
        loadingText: "Declining...",
        onConfirm: () => actions.declineLendingRequest(userBook.request._id),
      });

    case MODAL_TYPES.CANCEL_BORROW_REQUEST.value:
      return createFormModal("Cancel Borrow Request", BaseForm, {
        ...commonProps,
        confirmationMsg: `Are you sure you want to cancel your request for "${userBook.book.title}"?`,
        buttonText: "Cancel Request",
        loadingText: "Canceling Request...",
        successMessage: `Your borrow request for "${userBook.book.title}" has been canceled.`,
        onConfirm: () => actions.cancelBorrowRequest(userBook.request._id),
      });

    // Book Handover Flow
    case MODAL_TYPES.LENDER_CONFIRM_DROP_OFF.value:
      return createFormModal("Lender Confirm Drop Off", BaseForm, {
        ...commonProps,
        confirmationMsg: `Confirm drop off of "${userBook.book.title}" to ${userBook.sender.username}?`,
        buttonText: "Confirm Drop Off",
        loadingText: "Confirming Drop Off...",
        successMessage: `Drop off of "${userBook.book.title}" has been confirmed!`,
        onConfirm: () =>
          actions.confirmLenderDropOff(
            userBook.request._id,
            userBook.request.pictureRequired
          ),
      });

    case MODAL_TYPES.BORROWER_CONFIRM_PICKUP.value:
      return createFormModal("Borrower Confirm Pickup", BaseForm, {
        ...commonProps,
        confirmationMsg: `Confirm pickup of "${userBook.book.title}" from ${userBook.owner.username}?`,
        buttonText: "Confirm Pickup",
        loadingText: "Confirming Pickup...",
        successMessage: `Pickup of "${userBook.book.title}" has been confirmed!`,
        onConfirm: () =>
          actions.confirmBorrowerPickup(
            userBook.request._id,
            userBook.request.pictureRequired
          ),
      });

    // Book Return Flow
    case MODAL_TYPES.REQUEST_BORROW_EXTENSION.value:
      return createFormModal("Extend Borrow", BaseForm, {
        ...commonProps,
        confirmationMsg: `Would you like to request a loan extension for "${userBook.book.title}" from ${userBook.owner.username}?`,
        buttonText: "Request Extension",
        loadingText: "Requesting Extension...",
        onConfirm: () => actions.extendBorrow(userBook.request._id),
      });

    case MODAL_TYPES.REQUEST_BOOK_RETURN.value:
      return createFormModal("Request Book Return", BaseForm, {
        ...commonProps,
        confirmationMsg: `Do you want to request a return for ${userBook.book.title} from ${userBook.sender.username}?`,
        buttonText: "Request Return",
        loadingText: "Requesting Return...",
        onConfirm: () => actions.requestBookReturn(userBook.request._id),
      });
    case MODAL_TYPES.CANCEL_BOOK_RETURN.value:
      return createFormModal("Cancel Book Return", BaseForm, {
        ...commonProps,
        confirmationMsg: `Are you sure you want to cancel your return request for ${userBook.book.title}?`,
        buttonText: "Cancel Return",
        loadingText: "Canceling Return...",
        onConfirm: () => actions.cancelBookReturn(userBook.request._id),
      });

    case MODAL_TYPES.INITIATE_BOOK_RETURN.value:
      return createFormModal("Return Book", BaseForm, {
        ...commonProps,
        confirmationMsg: `Do you want to return ${userBook.book.title} to ${userBook.owner.username}?`,
        buttonText: "Return Book",
        loadingText: "Returning Book...",
        onConfirm: () => actions.initiateBookReturn(userBook.request._id),
      });

    case MODAL_TYPES.BORROWER_CONFIRM_RETURN.value:
      return createFormModal("Borrower Confirm Return", BaseForm, {
        ...commonProps,
        confirmationMsg: `Confirm return of "${userBook.book.title}" to ${userBook.owner.username}?`,
        buttonText: "Confirm Return",
        loadingText: "Confirming Return...",
        onConfirm: () =>
          actions.confirmBorrowerReturn(
            userBook.request._id,
            userBook.request.pictureRequired
          ),
      });

    case MODAL_TYPES.LENDER_CONFIRM_RETURN.value:
      return createFormModal("Lender Confirm Return", BaseForm, {
        ...commonProps,
        confirmationMsg: `Confirm return of "${userBook.book.title}" from ${userBook.sender.username}?`,
        buttonText: "Confirm Return",
        loadingText: "Confirming Return...",
        onConfirm: () =>
          actions.confirmLenderReturn(
            userBook.request._id,
            userBook.request.pictureRequired
          ),
      });

    // Library Management
    case MODAL_TYPES.REMOVE_FROM_LIBRARY.value:
      return createFormModal("Remove Book", BaseForm, {
        ...commonProps,
        confirmationMsg: `Are you sure you want to remove "${userBook.book.title}" from your library?`,
        buttonText: "Remove Book",
        loadingText: "Removing...",
        successMessage: `"${userBook.book.title}" has been removed from your library.`,
        onConfirm: () => actions.deleteBookFromLibrary(userBook._id),
      });

    default:
      return null;
  }
};

// Modal content component
export const BookModalContent = ({ modal, onClose }) => {
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

  const label = config.label || modal.title || "";

  console.log("modal.data", modal.data);

  return (
    <FormContainer bookData={modal.data.userBook} label={label}>
      {config.component}
    </FormContainer>
  );
};
