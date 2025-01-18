import { useDispatch, useSelector } from "react-redux";
import { updateCurrentPage } from "../../../features/library";
import {
  cancelBorrowRequest as cancelBorrowRequestAction,
  declineLendingRequest as declineLendingRequestAction,
  createBookRequest,
  deleteUserBook,
  updateCurrentRead,
  updateBorrowRequestStatus,
  updateLendRequestStatus,
  initiateBookReturnRequest,
  cancelBookReturnRequest,
  updateRequestPictureRequired,
} from "../userBooksSlice";
import {
  markAsRead,
  selectNotificationByRequestRefIdCreator,
} from "../../Notifications/notificationsSlice";
import REQUEST_STATUS from "../../../data/requestStatus";
import { useCamera } from "../../../components/CameraCapture/hooks/useCamera";
// Constants
const REQUEST_OWNER = {
  BORROWER: "borrower",
  LENDER: "lender",
};

export const useBookActions = () => {
  const dispatch = useDispatch();
  const selectNotificationByRequestRefId = useSelector(
    selectNotificationByRequestRefIdCreator
  );
  const { takePicture } = useCamera();

  // Helper function to handle dispatch operations
  const dispatchAction = async (action, errorMessage = null) => {
    try {
      await dispatch(action).unwrap();
      return true;
    } catch (error) {
      if (errorMessage) console.error(errorMessage, error);
      return false;
    }
  };

  const requestBookReturn = async (request_id) => {
    return await dispatchAction(
      initiateBookReturnRequest({
        request_id,
        status: REQUEST_STATUS.CHECKED_OUT,
      }),
      "error in requestBookReturn"
    );
  };

  const cancelBookReturn = async (request_id) => {
    return await dispatchAction(
      cancelBookReturnRequest(request_id),
      "error in cancelBookReturn"
    );
  };

  // Main request handling function
  const requestActionAndMarkNotificationAsRead = async ({
    request_id,
    requestOwner,
    currentStatus,
    nextStatus,
    errorMessage,
    needsPictureConfirmation = false,
  }) => {
    try {
      let imageFile = null;
      if (needsPictureConfirmation) {
        alert("picture required");
        imageFile = await takePicture();
        console.log("imageFile", imageFile);
      }
      // Handle the request update
      let requestUpdateSuccess = false;
      if (requestOwner === REQUEST_OWNER.BORROWER) {
        requestUpdateSuccess = await dispatchAction(
          updateBorrowRequestStatus({
            request_id,
            status: nextStatus,
            imageFile,
          }),
          errorMessage
        );
      } else if (requestOwner === REQUEST_OWNER.LENDER) {
        requestUpdateSuccess = await dispatchAction(
          updateLendRequestStatus({
            request_id,
            status: nextStatus,
            imageFile,
          }),
          errorMessage
        );
      } else {
        console.error("Invalid request owner", requestOwner);
        return false;
      }

      // Only mark notification as read if request update was successful
      if (requestUpdateSuccess) {
        const notification = selectNotificationByRequestRefId(
          request_id,
          currentStatus
        );
        if (notification && !notification.isRead) {
          return await dispatchAction(
            markAsRead(notification._id),
            "error in mark notification as read"
          );
        }
        console.warn("notification not found");
        return true;
      }
      return false;
    } catch (error) {
      console.error(errorMessage, error);
      return false;
    }
  };

  // Library Management
  const deleteBookFromLibrary = (userBookId) =>
    dispatchAction(deleteUserBook(userBookId));

  const setCurrentRead = (userBookId) =>
    dispatchAction(updateCurrentRead(userBookId));

  // Reading Progress Actions
  const updateReadingProgress = (request_id, currentPage, userBook_id) =>
    dispatchAction(updateCurrentPage({ request_id, currentPage, userBook_id }));

  const completeBook = (request_id, userBook_id, pageCount) =>
    dispatchAction(
      updateCurrentPage({
        request_id,
        userBook_id,
        currentPage: pageCount,
      })
    );

  // Borrowing/Lending Actions
  const createBorrowRequest = (userBookId) =>
    dispatchAction(createBookRequest(userBookId));

  const updateBorrowRequestPictureRequired = async (
    request_id,
    pictureRequired
  ) => {
    return await dispatchAction(
      updateRequestPictureRequired({ request_id, pictureRequired }),
      "error updating picture requirement"
    );
  };

  // Updated confirm borrow request
  const confirmBorrowRequest = async (request_id, pictureRequired) => {
    if (pictureRequired) {
      const pictureUpdateSuccess = await updateBorrowRequestPictureRequired(
        request_id,
        pictureRequired
      );
      if (!pictureUpdateSuccess) {
        return false;
      }
    }

    return requestActionAndMarkNotificationAsRead({
      request_id,
      requestOwner: REQUEST_OWNER.LENDER,
      currentStatus: REQUEST_STATUS.CHECKED_IN,
      nextStatus: REQUEST_STATUS.ACCEPTED,
      errorMessage: "error in confirmBorrowRequest",
    });
  };

  const confirmLenderDropOff = (request_id, pictureRequired) =>
    requestActionAndMarkNotificationAsRead({
      request_id,
      requestOwner: REQUEST_OWNER.LENDER,
      currentStatus: REQUEST_STATUS.ACCEPTED,
      nextStatus: REQUEST_STATUS.SENDING,
      errorMessage: "error in confirmLenderDropOff",
      needsPictureConfirmation: pictureRequired,
    });

  const confirmBorrowerPickup = (request_id, pictureRequired) =>
    requestActionAndMarkNotificationAsRead({
      request_id,
      requestOwner: REQUEST_OWNER.BORROWER,
      currentStatus: REQUEST_STATUS.SENDING,
      nextStatus: REQUEST_STATUS.CHECKED_OUT,
      errorMessage: "error in confirmBorrowerPickup",
      needsPictureConfirmation: pictureRequired,
    });

  const confirmBorrowerReturn = (request_id, pictureRequired) =>
    requestActionAndMarkNotificationAsRead({
      request_id,
      requestOwner: REQUEST_OWNER.BORROWER,
      currentStatus: REQUEST_STATUS.IS_DUE,
      nextStatus: REQUEST_STATUS.RETURNING,
      errorMessage: "error in confirmBorrowerReturn",
      needsPictureConfirmation: pictureRequired,
    });

  const confirmLenderReturn = (request_id, pictureRequired) =>
    requestActionAndMarkNotificationAsRead({
      request_id,
      requestOwner: REQUEST_OWNER.LENDER,
      currentStatus: REQUEST_STATUS.RETURNING,
      nextStatus: REQUEST_STATUS.RETURNED,
      errorMessage: "error in confirmLenderReturn",
      needsPictureConfirmation: pictureRequired,
    });

  const initiateBookReturn = (request_id) =>
    requestActionAndMarkNotificationAsRead({
      request_id,
      requestOwner: REQUEST_OWNER.BORROWER,
      currentStatus: REQUEST_STATUS.CHECKED_OUT,
      nextStatus: REQUEST_STATUS.IS_DUE,
      errorMessage: "error in initiateBookReturn",
    });

  const cancelBorrowRequest = (request_id) =>
    dispatchAction(
      cancelBorrowRequestAction(request_id),
      "error in cancelPendingBorrowRequest"
    );

  const declineLendingRequest = (request_id) =>
    dispatchAction(
      declineLendingRequestAction(request_id),
      "error in declineLendingRequest"
    );

  const extendBorrow = (request_id) => alert("feature on the way");
  // dispatchAction(extendBorrowRequest(request_id), "error in extendBorrow");

  return {
    // Library Management
    deleteBookFromLibrary,
    setCurrentRead,
    // Reading Progress
    updateReadingProgress,
    completeBook,
    // Borrowing/Lending
    confirmBorrowRequest,
    createBorrowRequest,
    confirmLenderDropOff,
    confirmBorrowerPickup,
    initiateBookReturn,
    confirmBorrowerReturn,
    confirmLenderReturn,
    extendBorrow,
    requestBookReturn,
    cancelBookReturn,
    //remove request Borrower/Lender
    cancelBorrowRequest,
    declineLendingRequest,
    updateBorrowRequestPictureRequired, // Optionally expose this if needed elsewhere
  };
};
