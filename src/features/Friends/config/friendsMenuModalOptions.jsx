import FriendModalWrapper from "../components/FriendModalContent/FriendModalContent";
import { MODAL_TYPES } from "../hooks/friendModalTypesAndActions";

const getFriendModalConfig = (type, data, closeModal) => {
  if (!data) return null;
  switch (type) {
    case MODAL_TYPES.MAKE_FRIEND_REQUEST.value:
      return (
        <FriendModalWrapper.MakeFriendRequest
          user={data}
          onClose={closeModal}
        />
      );
    case MODAL_TYPES.ACCEPT_FRIEND_REQUEST.value:
      return (
        <FriendModalWrapper.AcceptFriendRequest
          user={data}
          onClose={closeModal}
        />
      );
    case MODAL_TYPES.REMOVE_FRIEND.value:
      return (
        <FriendModalWrapper.RemoveFriend user={data} onClose={closeModal} />
      );
    default:
      return null;
  }
};

// Modal content component
export const FriendModalContent = ({ modal, onClose }) => {
  const config = getFriendModalConfig(modal.type, modal.data, onClose);
  console.log("FriendModalContent", modal);
  console.log("config", config);
  // Defensive rendering
  if (!config) {
    return null;
  }

  return <div>{config}</div>;
};
