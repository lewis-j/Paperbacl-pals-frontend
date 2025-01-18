import React from "react";
import { Card, Button } from "reactstrap";
import {
  IconBook,
  IconTruck,
  IconCheck,
  IconRotateClockwise,
  IconAlertCircle,
} from "@tabler/icons";
import styles from "./BookStatusTracker.module.scss";
import requestStatus from "../../../../data/requestStatus";
import { useStatusModal } from "./hooks/useStatusModal";

const statusConfig = {
  // [requestStatus.CHECKED_IN]: {
  //   index: 0,
  //   label: "Available",
  //   icon: IconBook,
  // },
  [requestStatus.ACCEPTED]: {
    index: 1,
    label: "Accepted",
    icon: IconCheck,
    ownerAction: "Confirm Drop-off",
    timestamp: null,
  },
  [requestStatus.SENDING]: {
    index: 2,
    label: "Owner Drop-off",
    icon: IconTruck,
    borrowerAction: "Confirm Pickup",
    timestamp: null,
  },
  [requestStatus.CHECKED_OUT]: {
    index: 3,
    label: "With Borrower",
    icon: IconBook,
    timestamp: null,
  },
  [requestStatus.IS_DUE]: {
    index: 4,
    label: "Due Soon",
    icon: IconAlertCircle,
    borrowerAction: "Confirm Drop-off",
    timestamp: null,
  },
  [requestStatus.RETURNING]: {
    index: 5,
    label: "Lender-Drop-off",
    icon: IconTruck,
    ownerAction: "Confirm Return Pickup",
    timestamp: null,
  },
  [requestStatus.RETURNED]: {
    index: 6,
    label: "Returned",
    icon: IconRotateClockwise,
    timestamp: null,
  },
};

const BookStatusTracker = ({
  userBook,
  isBorrower = true,
  onAction,
  isColumn = false,
}) => {
  console.log("userBook in tracker", userBook);
  const userBookSnapshot = { ...userBook };
  const currentStatus = userBook?.request?.status;
  const currentStatusConfig = statusConfig[currentStatus];

  const { openModal, renderStatusModal } = useStatusModal();

  if (userBook?.request?.statusHistory) {
    userBook.request.statusHistory.forEach((statusObj) => {
      if (statusConfig[statusObj.status]) {
        statusConfig[statusObj.status].timestamp = statusObj.timestamp;
        if (userBook.request.pictureRequired && statusObj.imageUrl) {
          statusConfig[statusObj.status].img = statusObj.imageUrl;
        }
      }
    });
  }
  console.log("statusConfig", statusConfig);

  const getActionButton = () => {
    const action = isBorrower
      ? currentStatusConfig?.borrowerAction
      : currentStatusConfig?.ownerAction;

    if (!action) return null;

    return (
      <Button
        color="primary"
        className={styles.actionButton}
        onClick={() => onAction(userBookSnapshot)}
      >
        {action}
      </Button>
    );
  };

  const renderStatusStep = (status, isActive) => {
    const StatusIcon = status.icon;
    return (
      <div
        className={`${isColumn ? styles.stepCol : styles.step} ${
          isActive ? styles.active : ""
        } `}
        key={status.label}
      >
        <div className={styles.iconWrapper}>
          <StatusIcon size={24} />
          {status.img && (
            <div className={styles.imageIndicator}>
              <img
                src={status.img}
                alt={status.label}
                onClick={() => openModal(status)}
                className={styles.previewImage}
              />
            </div>
          )}
        </div>
        <div className={styles.label}>
          {status.label}
          {status.timestamp && (
            <div className={styles.timestamp}>
              {new Date(status.timestamp).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>
    );
  };

  console.log("userBook", userBook);

  return (
    <>
      {renderStatusModal()}
      <Card className={styles.tracker}>
        <div className={styles.bookInfo}>
          <img
            src={userBook.book.coverImg}
            alt={userBook.book.title}
            className={styles.coverImg}
          />
          <div className={styles.details}>
            <h5>{userBook.book.title}</h5>
            <p>
              {isBorrower
                ? `Owner: ${userBook.owner.username}`
                : `Borrower: ${userBook.sender.username}`}
            </p>
            {userBook.dueDate && currentStatus === "IS_DUE" && (
              <p className={styles.dueDate}>
                Due: {new Date(userBook.dueDate).toLocaleDateString()}
              </p>
            )}
          </div>
          {getActionButton()}
        </div>
        <div className={isColumn ? styles.statusStepsCol : styles.statusSteps}>
          {Object.values(statusConfig).map((status) =>
            renderStatusStep(status, currentStatusConfig?.index >= status.index)
          )}
        </div>
      </Card>
    </>
  );
};

export default BookStatusTracker;
