import { createSelector } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import {
  categorizeBorrowedBooksByStatus,
  categorizeOwnedBooksByStatus,
} from "../utilities/bookFilterUtil";

// Base selectors (now selecting from full Redux state)
const selectUserBooksSlice = (state) => state.userBooks;

const selectOwnedBooks = createSelector(
  [selectUserBooksSlice],
  (userBooks) => userBooks?.books?.owned || []
);

const selectBorrowedBooks = createSelector(
  [selectUserBooksSlice],
  (userBooks) => userBooks?.books?.borrowed || []
);

const selectCurrentRead = createSelector(
  [selectUserBooksSlice],
  (userBooks) => userBooks?.currentRead
);

// Categorized books selectors
const selectCategorizedOwnedBooks = createSelector(
  [selectOwnedBooks],
  (ownedBooks) => categorizeOwnedBooksByStatus(ownedBooks)
);

const selectCategorizedBorrowedBooks = createSelector(
  [selectBorrowedBooks],
  (borrowedBooks) => categorizeBorrowedBooksByStatus(borrowedBooks)
);

// Derived selectors
const selectBooksToFriends = createSelector(
  [selectCategorizedOwnedBooks],
  (categories) => {
    const booksToFriends = categories.CHECKED_OUT || [];
    booksToFriends.push(...(categories.RETURN_REQUESTED || []));
    return booksToFriends;
  }
);

const selectBooksFromFriends = createSelector(
  [selectCategorizedBorrowedBooks],
  (categories) => {
    const booksFromFriends = categories.CHECKED_OUT || [];
    booksFromFriends.push(...(categories.RETURN_REQUESTED || []));
    return booksFromFriends;
  }
);

const selectBooksInLibrary = createSelector(
  [selectCategorizedOwnedBooks],
  (categories) => categories.CHECKED_IN || []
);

const selectBorrowedBookRequests = createSelector(
  [selectCategorizedBorrowedBooks],
  (categories) => categories.CHECKED_IN || []
);

const selectBooksInTransition = createSelector(
  [selectCategorizedOwnedBooks, selectCategorizedBorrowedBooks],
  (ownedCategories, borrowedCategories) => {
    const TRANSITION_STATUSES = ["SENDING", "RETURNING", "ACCEPTED", "IS_DUE"];

    const getTransitionBooks = (categories) =>
      TRANSITION_STATUSES.map((status) => categories[status])
        .filter(Boolean)
        .flat();

    return {
      owned: getTransitionBooks(ownedCategories),
      borrowed: getTransitionBooks(borrowedCategories),
    };
  }
);

const selectOwnedBookRequests = createSelector(
  [selectCategorizedOwnedBooks],
  (categories) =>
    categories.CHECKED_IN?.filter(
      (book) => book.requests && book.requests.length > 0
    ) || []
);

// Move the currentRead logic into a selector
const selectCurrentReadBook = createSelector(
  [selectBooksFromFriends, (state) => state.userBooks.currentRead?._id],
  (booksFromFriends, currentReadId) => {
    if (!currentReadId) return null;
    return booksFromFriends.find((book) => book._id === currentReadId);
  }
);

// Move the filterOutCurrentRead logic into a selector
const selectFilteredBooksFromFriends = createSelector(
  [selectBooksFromFriends, selectCurrentRead],
  (books, currentRead) => {
    if (!currentRead) return books;
    return books.filter((book) => book._id !== currentRead._id);
  }
);

export const useBookSelectors = () => {
  // Get all data using useSelector at the top of the hook
  const userBooks = useSelector(selectUserBooksSlice);
  const booksFromFriends = useSelector(selectBooksFromFriends);
  const booksInTransition = useSelector(selectBooksInTransition);
  const currentRead = useSelector(selectCurrentReadBook);
  const filteredBooksFromFriends = useSelector(selectFilteredBooksFromFriends);
  const booksToFriends = useSelector(selectBooksToFriends);
  const booksInLibrary = useSelector(selectBooksInLibrary);
  const ownedBookRequests = useSelector(selectOwnedBookRequests);
  const borrowedBookRequests = useSelector(selectBorrowedBookRequests);

  if (
    !userBooks?.books?.owned &&
    !userBooks?.books?.borrowed &&
    !userBooks?.currentRead
  ) {
    return {};
  }

  return {
    currentRead,
    booksFromFriends: filteredBooksFromFriends,
    allBooksFromFriends: booksFromFriends,
    booksToFriends,
    booksInLibrary,
    ownedbooksInTransition: booksInTransition.owned,
    borrowedbooksInTransition: booksInTransition.borrowed,
    ownedBookRequests,
    borrowedBookRequests,
  };
};
