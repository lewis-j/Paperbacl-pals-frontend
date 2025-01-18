import { batch } from "react-redux";
import {
  setFriendRequestInbox,
  setFriendRequestOutbox,
  setFriends,
} from "../Friends";
import { setBooks, setCurrentRead } from "../library";

const mergeFriendsIntoRequest = (friends, ownedBooks) => {
  if (!ownedBooks) return [];
  return ownedBooks.map((book) => {
    const requests =
      book.requests?.map((request) => {
        const friend = friends.find(
          (friend) => friend._id === request.sender._id
        );
        return { ...request, sender: friend };
      }) ?? [];
    return { ...book, requests };
  });
};

export const parseAndDispatchUserData = (dispatch, userData) => {
  console.log(userData);
  const {
    friends = [],
    friendRequestInbox,
    friendRequestOutbox,
    ownedBooks: owned = [],
    borrowedBooks: borrowed = [],
    currentRead,
    ...user
  } = userData;

  batch(() => {
    dispatch(
      setFriendRequestInbox({ friendRequestInbox: friendRequestInbox ?? [] })
    );
    dispatch(
      setFriendRequestOutbox({ friendRequestOutbox: friendRequestOutbox ?? [] })
    );
    dispatch(setCurrentRead({ currentRead }));
    dispatch(setFriends({ friends }));
    const mergedfriendIntoBooks = mergeFriendsIntoRequest(friends, owned);
    dispatch(setBooks({ borrowed, owned: mergedfriendIntoBooks }));
  });
  console.log("user after mapping", user);
  return { user };
};
