import requestStatus from "../../../data/requestStatus";

export const categorizeOwnedBooksByStatus = (ownedBooks) => {
  let categorizedBooks = {};
  ownedBooks.forEach((userBook) => {
    // Find the first active request (if any)
    const activeRequest = userBook.requests.find((request) =>
      Object.keys(requestStatus).slice(1, -1).includes(request.status)
    );
    if (activeRequest) {
      const status = activeRequest.status;
      const singleRequestBook = {
        ...userBook,
        dueDate: activeRequest.dueDate,
        currentPage: activeRequest.currentPage,
        sender: activeRequest.sender,
        requests: userBook.requests,
        request: {
          statusHistory: activeRequest.statusHistory,
          status: activeRequest.status,
          _id: activeRequest._id,
          pictureRequired: activeRequest.pictureRequired,
        },
      };
      console.log("activeRequest", activeRequest);
      console.log("singleRequestBook", singleRequestBook);

      categorizedBooks[status] = categorizedBooks[status]
        ? [...categorizedBooks[status], singleRequestBook]
        : [singleRequestBook];
    } else {
      // If no active request, book is checked in
      categorizedBooks[requestStatus.CHECKED_IN] = categorizedBooks[
        requestStatus.CHECKED_IN
      ]
        ? [
            ...categorizedBooks[requestStatus.CHECKED_IN],
            { ...userBook, request: { status: requestStatus.CHECKED_IN } },
          ]
        : [{ ...userBook, request: { status: requestStatus.CHECKED_IN } }];
    }
  });

  return categorizedBooks;
};

export const categorizeBorrowedBooksByStatus = (borrowedBooks) => {
  const categorizedBooks = {};
  borrowedBooks.forEach((userBook) => {
    const status = userBook.request.status;
    categorizedBooks[status] = categorizedBooks[status]
      ? [...categorizedBooks[status], userBook]
      : [userBook];
  });

  return categorizedBooks;
};
