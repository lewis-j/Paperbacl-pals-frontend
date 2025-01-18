import React from "react";
import styles from "./UserRequestCard.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Avatar, Button } from "../../../../components";
import {
  faUserPlus,
  faCheckCircle,
  faUserCheck,
  faUserGroup,
  faCheck,
  faCircleUser,
} from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { useFriendRequestModal } from "../../../Friends/hooks/useFriendRequestModal";

const UserRequestCard = ({ username, profilePic, _id: person_id }) => {
  const { renderModal, friendModalActions } = useFriendRequestModal();
  const handleRequestFriend = () => {
    friendModalActions.makeFriendRequest({ username, profilePic, person_id });
  };
  const handleAcceptFriend = (request_id) => {
    friendModalActions.acceptFriendRequest({
      username,
      profilePic,
      _id: person_id,
      request_id,
    });
  };

  const { friendsList, friendRequestInbox, friendRequestOutbox } = useSelector(
    (state) => state.friends
  );

  const { _id: user_id } = useSelector((state) => state.authUser.currentUser);
  const createFilteredUserIdSelector = (person_id) => (list) => {
    return list.find((person) => person._id === person_id);
  };
  const getBtn = () => {
    const userInList = createFilteredUserIdSelector(person_id);

    // Define all possible button states
    const userCardStates = {
      isCurrentUser: {
        condition: [{ _id: user_id }],
        render: () => (
          <div className={styles.userIcon}>
            <FontAwesomeIcon icon={faCircleUser} size="xl" />
          </div>
        ),
      },
      isFriend: {
        condition: friendsList,
        render: () => (
          <div className={styles.friendIcon}>
            <FontAwesomeIcon icon={faUserGroup} size="sm" />
            <FontAwesomeIcon icon={faCheck} size="sm" />
          </div>
        ),
      },
      hasOutgoingRequest: {
        condition:
          friendRequestOutbox?.map((request) => ({
            _id: request.recipient._id,
            request_id: request._id,
          })) ?? [],
        render: () => (
          <div className={styles.pendingIcon}>
            <FontAwesomeIcon icon={faCheckCircle} /> Requested
          </div>
        ),
      },
      hasIncomingRequest: {
        condition:
          friendRequestInbox?.map((request) => ({
            _id: request.sender._id,
            request_id: request._id,
          })) ?? [],
        render: ({ request_id }) => (
          <Button
            variant="primary"
            icon={faUserCheck}
            onClick={() => handleAcceptFriend(request_id)}
          >
            Accept
          </Button>
        ),
      },
    };

    // Default button state (Send friend request)
    const defaultButton = (
      <Button
        variant="primary"
        icon={faUserPlus}
        onClick={handleRequestFriend}
        className={styles.requestButton}
        size="sm"
      >
        Request
      </Button>
    );

    // Find the first matching state and render its button
    for (const { condition, render } of Object.values(userCardStates)) {
      const matchingUser = userInList(condition);
      if (matchingUser) {
        return render(matchingUser);
      }
    }

    return defaultButton;
  };

  return (
    <>
      {renderModal()}
      <div className={styles.container} key={person_id}>
        <div className={styles.userInfo}>
          <Avatar imgSrc={profilePic} username={username} />
          <span className={styles.username}>{username}</span>
        </div>
        {getBtn()}
      </div>
    </>
  );
};

export default UserRequestCard;
