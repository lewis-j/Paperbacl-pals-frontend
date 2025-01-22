import { createSelector } from "@reduxjs/toolkit";
import {
  categorizeBorrowedBooksByStatus,
  categorizeOwnedBooksByStatus,
} from "../utilities/bookFilterUtil";
import { useSelector } from "react-redux";

const getCurrentFriend = (state) => state.friends.currentFriend;

const mapOwnerIntoBooks = (currentFriend) => (book) => ({
  ...book,
  owner: {
    _id: currentFriend._id,
    username: currentFriend.username,
    profilePic: currentFriend.profilePic,
  },
});

const selectOwnedBooks = createSelector(
  [getCurrentFriend],
  (currentFriend) =>
    currentFriend.ownedBooks.map(mapOwnerIntoBooks(currentFriend)) || []
);

const selectBorrowedBooks = createSelector(
  [getCurrentFriend],
  (currentFriend) =>
    currentFriend.borrowedBooks.map(mapOwnerIntoBooks(currentFriend)) || []
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

const selectBooksInLibrary = createSelector(
  [selectCategorizedOwnedBooks],
  (categories) => categories.CHECKED_IN || []
);

const selectBorrowedBookRequests = createSelector(
  [selectCategorizedBorrowedBooks],
  (categories) => categories.CHECKED_IN || []
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

export const useFriendsBooksSelector = () => {
  const ownedBooks = useSelector(selectOwnedBooks);
  const borrowedBooks = useSelector(selectBorrowedBooks);
  const booksInLibrary = useSelector(selectBooksInLibrary);
  const borrowedBookRequests = useSelector(selectBorrowedBookRequests);
  const booksToFriends = useSelector(selectBooksToFriends);
  return {
    ownedBooks,
    borrowedBooks,
    booksInLibrary,
    borrowedBookRequests,
    booksToFriends,
  };
};
