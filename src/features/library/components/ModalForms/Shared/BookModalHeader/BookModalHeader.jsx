import React from "react";
import styles from "./BookModalHeader.module.scss";
import { Avatar, ProgressBar } from "../../../../../../components";
import { getProgressInPercent } from "../../../../../../utilities/bookUtilities";

const BookModalHeader = ({
  book,
  owner,
  sender,
  currentPage,
  dueDate = null,
  showProgress = true,
  showOwner = true,
}) => {
  const { coverImg, title, authors, pageCount = 0 } = book;
  const progressPercent = getProgressInPercent(currentPage, pageCount);

  console.log("sender", sender);

  return (
    <div className={styles.bookHeader}>
      <div className={styles.bookCard}>
        <div className={styles.imgContainer}>
          <img
            src={coverImg}
            alt={title}
            className={styles.coverImg}
            referrerPolicy="no-referrer"
          />
        </div>
        <div className={styles.details}>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.authors}>{authors.join(", ")}</p>

          {showOwner && owner && (
            <div className={styles.ownerInfo}>
              <Avatar imgSrc={owner.profilePic} username={owner.username} />
              <span className={styles.ownerName}>{owner.username}</span>
            </div>
          )}
          {sender && (
            <div className={styles.senderInfo}>
              <Avatar imgSrc={sender.profilePic} username={sender.username} />
              <span className={styles.senderName}>{sender.username}</span>
            </div>
          )}

          {dueDate && (
            <dl className={styles.dueDateList}>
              <dt className={styles.dueDateTerm}>Due Date:</dt>
              <dd className={styles.dueDateDesc}>
                {new Date(dueDate).toLocaleDateString()}
              </dd>
            </dl>
          )}

          {showProgress && progressPercent > 0 && (
            <div className={styles.progressContainer}>
              <small className={styles.progressText}>
                Reading Progress: {currentPage} of {pageCount}
              </small>
              <ProgressBar value={progressPercent} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookModalHeader;
