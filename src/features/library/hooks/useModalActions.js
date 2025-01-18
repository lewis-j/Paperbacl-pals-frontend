import { useDispatch } from "react-redux";
import { MODAL_TYPES } from "../config/modals";
import { openChatWithFriend } from "../../Chat/chatSlice";

export const useModalActions = (openModal) => {
  const dispatch = useDispatch();

  const openChatModal = async (userId) => {
    dispatch(openChatWithFriend(userId));
  };

  return {
    openModal,

    // Book Reading Progress
    viewBookDetails: (bookInfo) =>
      openModal(MODAL_TYPES.VIEW_BOOK_DETAILS, bookInfo),
    viewUserBookDetails: (userBook) =>
      openModal(MODAL_TYPES.VIEW_BOOK_DETAILS, { userBook }),
    updatePageCount: (userBook) =>
      openModal(MODAL_TYPES.UPDATE_PAGE_COUNT, { userBook }),
    setCurrentRead: (userBook) =>
      openModal(MODAL_TYPES.SET_CURRENT_READ, { userBook }),
    markBookComplete: (userBook) =>
      openModal(MODAL_TYPES.COMPLETE_BOOK, { userBook }),
    viewTransferHistory: (userBook) =>
      openModal(MODAL_TYPES.VIEW_TRANSFER_HISTORY, { userBook }),

    // Borrow Request Flow
    viewBorrowRequests: (userBook) =>
      openModal(MODAL_TYPES.VIEW_BORROW_REQUESTS, { userBook }),
    createBorrowRequest: (userBook) =>
      openModal(MODAL_TYPES.CREATE_BORROW_REQUEST, { userBook }),
    confirmBorrowRequest: (userBook) =>
      openModal(MODAL_TYPES.CONFIRM_BORROW_REQUEST, { userBook }),
    declineLendingRequest: (userBook) =>
      openModal(MODAL_TYPES.DECLINE_LENDING_REQUEST, { userBook }),
    cancelBorrowRequest: (userBook) =>
      openModal(MODAL_TYPES.CANCEL_BORROW_REQUEST, { userBook }),

    // Book Handover Flow
    lenderConfirmDropOff: (userBook) =>
      openModal(MODAL_TYPES.LENDER_CONFIRM_DROP_OFF, { userBook }),
    borrowerConfirmPickup: (userBook) =>
      openModal(MODAL_TYPES.BORROWER_CONFIRM_PICKUP, { userBook }),

    // Book Return Flow
    requestBorrowExtension: (userBook) =>
      openModal(MODAL_TYPES.REQUEST_BORROW_EXTENSION, { userBook }),
    requestBookReturn: (userBook) =>
      openModal(MODAL_TYPES.REQUEST_BOOK_RETURN, { userBook }),
    cancelBookReturn: (userBook) =>
      openModal(MODAL_TYPES.CANCEL_BOOK_RETURN, { userBook }),
    initiateBookReturn: (userBook) =>
      openModal(MODAL_TYPES.INITIATE_BOOK_RETURN, { userBook }),
    borrowerConfirmReturn: (userBook) =>
      openModal(MODAL_TYPES.BORROWER_CONFIRM_RETURN, { userBook }),
    lenderConfirmReturn: (userBook) =>
      openModal(MODAL_TYPES.LENDER_CONFIRM_RETURN, { userBook }),

    // Library Management
    removeFromLibrary: (userBook) =>
      openModal(MODAL_TYPES.REMOVE_FROM_LIBRARY, { userBook }),

    // Communication
    openChat: (userId) => {
      openChatModal(userId);
    },
  };
};
