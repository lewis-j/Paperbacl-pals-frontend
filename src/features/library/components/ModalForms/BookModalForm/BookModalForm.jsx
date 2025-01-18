import React, { useState } from "react";
import styles from "./BookModalForm.module.scss";
import { Button } from "../../../../../components";
import { useModal } from "../../../../../context/ModalContext";
import { MODAL_TYPES } from "../../../config/modals";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSpinner,
  faCheckCircle,
  faExclamationCircle,
} from "@fortawesome/free-solid-svg-icons";
import BookDetailsView from "../BookDetailsView/BookDetailsView";

const ReadingProgressView = ({ userBook, onClose, isSubmitting }) => {
  const { book, currentPage } = userBook;
  const pagesRemaining = book.pageCount - currentPage;

  return (
    <>
      <div className={styles.statsGrid}>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Pages Remaining</span>
          <span className={styles.statValue}>{pagesRemaining}</span>
        </div>
      </div>
      <div className={styles.buttonContainer}>
        <Button variant="cancel" onClick={onClose} disabled={isSubmitting}>
          Close
        </Button>
      </div>
    </>
  );
};

const UpdatePageForm = ({
  userBook,
  onClose,
  onUpdateProgress,
  isSubmitting,
}) => {
  const { _id: userBook_id, request, currentPage } = userBook;
  const [value, setValue] = useState(currentPage);

  if (!userBook) return null;

  const handleSubmit = () => {
    onUpdateProgress(request._id, value, userBook_id);
    onClose();
  };

  return (
    <>
      <input
        className={styles.pageInput}
        type="number"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        min="0"
        max={userBook.book.pageCount}
      />
      <div className={styles.buttonContainer}>
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={isSubmitting}
          icon={isSubmitting ? faSpinner : null}
        >
          Update Progress
        </Button>
      </div>
    </>
  );
};

// const BookDetailsView = ({ userBook, onClose, isSubmitting }) => {
//   const userBookAsyncStatus = useSelector((state) => state.userBooks.status);

//   if (!userBook) return null;
//   if (userBookAsyncStatus === asyncStatus.LOADING) return <Loading />;

//   return (
//     <>
//       <p className={styles.description}>{userBook.book.description}</p>
//       <div className={styles.buttonContainer}>
//         <Button variant="cancel" onClick={onClose} disabled={isSubmitting}>
//           Close
//         </Button>
//       </div>
//     </>
//   );
// };

const BorrowRequestsList = ({ userBook, onClose, isSubmitting }) => {
  const { openModal } = useModal();
  const requests = userBook.requests;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleRequestClick = (request) => {
    onClose();
    openModal(MODAL_TYPES.CONFIRM_BORROW_REQUEST, {
      userBook: { ...userBook, request, sender: request.sender },
    });
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.requestList}>
          {requests.map((request) => (
            <div
              key={request._id}
              className={`${styles.requestCard} ${styles.clickable}`}
              onClick={() => handleRequestClick(request)}
            >
              <div className={styles.userInfo}>
                <img
                  src={request.sender.profilePic}
                  alt={request.sender.username}
                  className={styles.profilePic}
                />
                <h4>{request.sender.username}</h4>
                <span className={styles.date}>
                  {formatDate(request.createdAt)}
                </span>
              </div>
            </div>
          ))}
        </div>
        <Button variant="cancel" onClick={onClose} disabled={isSubmitting}>
          Close
        </Button>
      </div>
    </>
  );
};

const ConfirmBorrowRequestForm = ({
  confirmationMsg,
  buttonText,
  loadingText,
  secondaryButtonText,
  onSecondaryAction,
  secondaryLoadingText,
  onConfirm,
  onClose,
  isSubmitting,
  error,
  successMessage = "Request accepted successfully!",
  secondarySuccessMessage = "Request declined successfully!",
}) => {
  const [status, setStatus] = useState({
    message: "",
    type: "",
  });

  const [checked, setChecked] = useState(true);

  const handleSubmit = async () => {
    try {
      const success = await onConfirm(checked);
      if (success) {
        setStatus({
          message: successMessage,
          type: "success",
        });
      }
    } catch (err) {
      setStatus({
        message: err.message || "Failed to accept request",
        type: "error",
      });
    }
  };

  const handleSecondaryAction = async () => {
    try {
      const success = await onSecondaryAction();
      if (success) {
        setStatus({
          message: secondarySuccessMessage,
          type: "success",
        });
      }
    } catch (err) {
      setStatus({
        message: err.message || "Failed to decline request",
        type: "error",
      });
    }
  };

  return (
    <div className={styles.formContainer}>
      {!status.message ? (
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
          <div className={styles.checkboxContainer}>
            <label>
              <input
                type="checkbox"
                checked={checked}
                onChange={(e) => setChecked(e.target.checked)}
              />
              Require picture proof of transaction
            </label>
          </div>
          <div className={styles.buttonContainer}>
            <Button variant="cancel" onClick={onClose} disabled={isSubmitting}>
              Close
            </Button>
            {secondaryButtonText && onSecondaryAction && (
              <Button
                variant="secondary"
                onClick={handleSecondaryAction}
                disabled={isSubmitting}
                icon={isSubmitting ? faSpinner : null}
              >
                {isSubmitting ? secondaryLoadingText : secondaryButtonText}
              </Button>
            )}
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={isSubmitting}
              icon={isSubmitting ? faSpinner : null}
            >
              {isSubmitting ? loadingText : buttonText}
            </Button>
          </div>
        </>
      ) : (
        <div className={styles.resultContainer}>
          <p className={`${styles.statusMessage} ${styles[status.type]}`}>
            <FontAwesomeIcon
              icon={
                status.type === "success" ? faCheckCircle : faExclamationCircle
              }
              className={styles.icon}
            />{" "}
            {status.message}
          </p>
          <Button variant="cancel" onClick={onClose} disabled={isSubmitting}>
            Close
          </Button>
        </div>
      )}
    </div>
  );
};

export const BaseForm = ({
  confirmationMsg,
  buttonText,
  loadingText,
  onConfirm,
  onClose,
  isSubmitting,
  error,
  successMessage = "Request accepted successfully!",
}) => {
  const [status, setStatus] = useState({
    message: "",
    type: "",
  });

  const handleSubmit = async () => {
    try {
      const success = await onConfirm();
      if (success) {
        setStatus({
          message: successMessage,
          type: "success",
        });
      }
    } catch (err) {
      setStatus({
        message: err.message || "Failed to accept request",
        type: "error",
      });
    }
  };
  return (
    <div className={styles.formContainer}>
      {!status.message ? (
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
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={isSubmitting}
              icon={isSubmitting ? faSpinner : null}
            >
              {isSubmitting ? loadingText : buttonText}
            </Button>
          </div>
        </>
      ) : (
        <div className={styles.resultContainer}>
          <p className={`${styles.statusMessage} ${styles[status.type]}`}>
            <FontAwesomeIcon
              icon={
                status.type === "success" ? faCheckCircle : faExclamationCircle
              }
              className={styles.icon}
            />{" "}
            {status.message}
          </p>
          <Button variant="cancel" onClick={onClose} disabled={isSubmitting}>
            Close
          </Button>
        </div>
      )}
    </div>
  );
};

const BookModalForm = {
  ReadingProgressView,
  UpdatePageForm,
  BookDetailsView,
  BorrowRequestsList,
  ConfirmBorrowRequestForm,
};

export default BookModalForm;
