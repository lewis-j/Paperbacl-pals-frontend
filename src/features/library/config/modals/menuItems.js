import requestStatus from "../../../../data/requestStatus";

export const getMenuItems = (modalActions) => {
  return {
    booksInLibrary: (userBook) => {
      return [
        {
          text: "Book Details",
          clickHandler: () => modalActions.viewUserBookDetails(userBook),
        },
        {
          text: "Remove Book",
          clickHandler: () => modalActions.removeFromLibrary(userBook),
        },
      ];
    },
    booksFromFriends: (userBook) => {
      // const userBook = getUserBookById(userBooks);

      return [
        {
          text: "Start Reading",
          clickHandler: () => modalActions.setCurrentRead(userBook),
        },
        {
          text: "Update Page",
          clickHandler: () => modalActions.updatePageCount(userBook),
        },
        {
          text: "Request Extension",
          clickHandler: () => modalActions.requestBorrowExtension(userBook),
        },
        {
          text: "Message Owner",
          clickHandler: () => modalActions.openChat(userBook.owner._id),
        },
        {
          text: "Return Book",
          clickHandler: () => modalActions.initiateBookReturn(userBook),
        },
      ];
    },

    currentRead: (currentRead) => [
      {
        text: "Update Progress",
        clickHandler: () => modalActions.updatePageCount(currentRead),
      },
      {
        text: "Mark as Complete",
        clickHandler: () => modalActions.markBookComplete(currentRead),
      },
      {
        text: "Book Details",
        clickHandler: () => modalActions.viewUserBookDetails(currentRead),
      },
      {
        text: "Return Book",
        clickHandler: () => modalActions.initiateBookReturn(currentRead),
      },
    ],

    booksToFriends: (userBook) => {
      const getReturnRequestMenuItem = (userBook, modalActions) => {
        const { request } = userBook;
        if (request.status === requestStatus.RETURN_REQUESTED) {
          return {
            text: "Cancel Return Request",
            clickHandler: () => modalActions.cancelBookReturn(userBook),
          };
        }
        return {
          text: "Request Return",
          clickHandler: () => modalActions.requestBookReturn(userBook),
        };
      };
      return [
        {
          text: "Message Borrower",
          clickHandler: () => modalActions.openChat(userBook.sender._id),
        },
        getReturnRequestMenuItem(userBook, modalActions),
        {
          text: "Book Details",
          clickHandler: () => modalActions.viewUserBookDetails(userBook),
        },
      ];
    },
    borrowedBookRequests: (userBook) => {
      // const userBook = getUserBookById(userBooks);
      return [
        {
          text: "Book Details",
          clickHandler: () => modalActions.viewUserBookDetails(userBook),
        },
        {
          text: "Message Owner",
          clickHandler: () => modalActions.openChat(userBook.owner._id),
        },
        {
          text: "Remove Request",
          clickHandler: () => {
            modalActions.cancelBorrowRequest(userBook);
          },
        },
      ];
    },
    friendsBooks: (userBook) => {
      // const userBook = getUserBookById(userBooks);
      return [
        {
          text: "Book Details",
          clickHandler: () => modalActions.viewUserBookDetails(userBook),
        },
        {
          text: "Message Owner",
          clickHandler: () => modalActions.openChat(userBook.owner._id),
        },
        {
          text: "Request Book",
          clickHandler: () => modalActions.createBorrowRequest(userBook),
        },
      ];
    },

    bookRequests: (userBook) => {
      // const userBook = getUserBookById(userBooks);

      return [
        {
          text: "View Requests",
          clickHandler: () => modalActions.viewBorrowRequests(userBook),
        },
        {
          text: "Remove from Library",
          clickHandler: () => modalActions.removeFromLibrary(userBook),
        },
      ];
    },
    bookHistory: (userBook) => {
      return [
        {
          text: "Book Details",
          clickHandler: () => modalActions.viewUserBookDetails(userBook),
        },
        {
          text: "Transfer History",
          clickHandler: () => modalActions.viewTransferHistory(userBook),
        },
      ];
    },
  };
};
