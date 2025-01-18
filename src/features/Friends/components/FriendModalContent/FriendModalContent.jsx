import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExclamationCircle,
  faCheckCircle,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./FriendModalContent.module.scss";
import { useDispatch, useSelector } from "react-redux";
import {
  acceptFriendRequest,
  removeFriend,
  sendFriendRequest,
} from "../../friendsSlice";
import {
  markAsRead,
  findPendingFriendRequestNotificationCreator,
} from "../../../Notifications/notificationsSlice";
import { Button } from "../../../../components";

const FriendModalContainer = ({ user, children: actionButtons }) => {
  return (
    <div className={styles.container}>
      <div className={styles.profileSection}>
        <img
          src={user.profilePic}
          alt={`${user.username}'s profile`}
          className={styles.profilePic}
        />
        <h2 className={styles.username}>{user.username}</h2>
      </div>

      {actionButtons}
    </div>
  );
};

const FriendRequestForm = ({
  confirmationMsg,
  buttonText,
  loadingText,
  secondaryButtonText = null,
  secondaryLoadingText = null,
  onSecondaryConfirm = null,
  onConfirm,
  onClose,
  resultMessage,
}) => {
  const { isSubmitting, isSuccess, isError, error } = useStatusHandlers();
  return (
    <div className={styles.formContainer}>
      {!resultMessage ? (
        <>
          <p className={styles.confirmation}>{confirmationMsg}</p>
          {error && (
            <p className={styles.errorMessage}>
              <FontAwesomeIcon
                icon={faExclamationCircle}
                className={styles.icon}
              />{" "}
              {error}
            </p>
          )}
          <div className={styles.buttonContainer}>
            <Button variant="cancel" onClick={onClose} disabled={isSubmitting}>
              Close
            </Button>
            {secondaryButtonText && (
              <Button
                variant="secondary"
                onClick={onSecondaryConfirm}
                disabled={isSubmitting}
                icon={isSubmitting ? faSpinner : null}
              >
                {isSubmitting ? secondaryLoadingText : secondaryButtonText}
              </Button>
            )}
            <Button
              variant="primary"
              onClick={onConfirm}
              disabled={isSubmitting}
              icon={isSubmitting ? faSpinner : null}
            >
              {isSubmitting ? loadingText : buttonText}
            </Button>
          </div>
        </>
      ) : (
        <div className={styles.resultContainer}>
          <p
            className={`${styles.statusMessage} ${
              isSuccess ? styles.success : isError ? styles.error : ""
            }`}
          >
            {(isSuccess || isError) && (
              <FontAwesomeIcon
                icon={isSuccess ? faCheckCircle : faExclamationCircle}
                className={styles.icon}
              />
            )}{" "}
            {resultMessage}
          </p>
          <Button
            variant="cancel"
            onClick={onClose}
            className={styles.closeButton}
          >
            Close
          </Button>
        </div>
      )}
    </div>
  );
};

const MakeFriendRequest = ({ user, onClose }) => {
  const { person_id } = user;
  const { actions, resultMessage } = useFriendModalActions(person_id);
  return (
    <FriendModalContainer user={user}>
      <FriendRequestForm
        confirmationMsg="Are you sure you want to send a friend request?"
        buttonText="Add Friend"
        loadingText="Adding friend..."
        onConfirm={actions.sendFriendRequest}
        onClose={onClose}
        resultMessage={resultMessage}
      />
    </FriendModalContainer>
  );
};

const AcceptFriendRequest = ({ user, onClose }) => {
  const { request_id } = user;
  console.log("AcceptFriendRequest in FriendModalContent", user);
  const { actions, resultMessage } = useFriendModalActions(request_id);

  return (
    <FriendModalContainer user={user}>
      <FriendRequestForm
        confirmationMsg="Are you sure you want to accept this friend request?"
        buttonText="Accept"
        loadingText="Accepting..."
        secondaryButtonText="Decline"
        secondaryLoadingText="Declining..."
        onConfirm={actions.acceptFriendRequest}
        onClose={onClose}
        resultMessage={resultMessage}
      />
    </FriendModalContainer>
  );
};

const RemoveFriend = ({ user, onClose }) => {
  const { actions, resultMessage } = useFriendModalActions(user.person_id);
  return (
    <FriendModalContainer user={user}>
      <FriendRequestForm
        confirmationMsg="Are you sure you want to remove this friend?"
        buttonText="Remove Friend"
        loadingText="Removing..."
        onConfirm={actions.removeFriend}
        onClose={onClose}
        resultMessage={resultMessage}
      />
    </FriendModalContainer>
  );
};

const useStatusHandlers = () => {
  const status = useSelector((state) => state.friends.status);
  const error = useSelector((state) => state.friends.error);

  return {
    isSubmitting: status === status.LOADING,
    isSuccess: status === status.SUCCEEDED,
    isError: status === status.FAILED,
    error,
  };
};

const useFriendModalActions = (_id) => {
  console.log("useFriendModalActions", _id);
  const dispatch = useDispatch();
  const findPendingFriendRequestNotification = useSelector(
    findPendingFriendRequestNotificationCreator
  );
  const [resultMessage, setResultMessage] = useState("");

  const createSubmitHandler = (onSubmit, successMessage) => {
    return async () => {
      setResultMessage("");
      try {
        await onSubmit();
        setResultMessage(successMessage || "Request processed successfully!");
      } catch (err) {
        setResultMessage(err.message || "Failed to process request");
      }
    };
  };

  const actions = {
    sendFriendRequest: createSubmitHandler(async () => {
      await dispatch(sendFriendRequest({ friend_id: _id })).unwrap();
    }, "Friend request sent successfully!"),
    acceptFriendRequest: createSubmitHandler(async () => {
      const notificationId = findPendingFriendRequestNotification(_id);
      console.log("notificationId", notificationId);
      await dispatch(markAsRead(notificationId)).unwrap();
      await dispatch(acceptFriendRequest({ request_id: _id })).unwrap();
    }, "Friend request accepted successfully!"),
    removeFriend: createSubmitHandler(async () => {
      await dispatch(removeFriend({ friend_id: _id })).unwrap();
    }, "Friend removed successfully!"),
  };

  return {
    actions,
    resultMessage,
  };
};

const FriendModalWrapper = {
  MakeFriendRequest,
  AcceptFriendRequest,
  RemoveFriend,
};

export default FriendModalWrapper;
