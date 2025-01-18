class ModalType {
  constructor(value, title) {
    this.value = value;
    this.title = title;
  }
  toString() {
    return this.value;
  }
}

export const MODAL_TYPES = {
  // Book Reading Progress
  MAKE_FRIEND_REQUEST: new ModalType("MAKE_FRIEND_REQUEST", "Friend request"),
  ACCEPT_FRIEND_REQUEST: new ModalType(
    "ACCEPT_FRIEND_REQUEST",
    "Accept friend request"
  ),
  REMOVE_FRIEND: new ModalType("REMOVE_FRIEND", "Remove friend"),
};

export const useFriendModalActions = (openModal) => {
  return {
    makeFriendRequest: (user) =>
      openModal(MODAL_TYPES.MAKE_FRIEND_REQUEST, user),
    acceptFriendRequest: (user) =>
      openModal(MODAL_TYPES.ACCEPT_FRIEND_REQUEST, user),
    removeFriend: (user) => openModal(MODAL_TYPES.REMOVE_FRIEND, user),
  };
};
