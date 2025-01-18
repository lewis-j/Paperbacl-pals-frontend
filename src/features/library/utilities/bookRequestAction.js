import requestStatus from "../../../data/requestStatus";

export const runBookRequestAction = (modalActions, userBook) => {
  if (userBook.isOwned) {
    switch (userBook.request.status) {
      case requestStatus.CHECKED_IN:
        modalActions.confirmBorrowRequest(userBook);
        break;
      case requestStatus.ACCEPTED:
        modalActions.lenderConfirmDropOff(userBook);
        break;
      case requestStatus.RETURNING:
        modalActions.lenderConfirmReturn(userBook);
        break;
      default:
        return null;
    }
  } else {
    switch (userBook.request.status) {
      case requestStatus.SENDING:
        modalActions.borrowerConfirmPickup(userBook);
        break;
      case requestStatus.IS_DUE:
        modalActions.borrowerConfirmReturn(userBook);
        break;
      default:
        return null;
    }
  }
};
