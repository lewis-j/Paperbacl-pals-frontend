import { Avatar, Button, ProgressBar } from "../../../../../components";

import "./UserCardLrg.scss";
import styles from "./UserCardLrg.module.scss";

import { getProgressInPercent } from "../../../../../utilities/bookUtilities";
import { dayMonthFormat } from "../../../../../utilities/timeUtil";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faClose } from "@fortawesome/free-solid-svg-icons";
import { BookMenuModal } from "../../BookMenuModal";

const UserBookCardLrg = ({
  _id: userCard_id,
  book,
  user,
  dueDate,
  currentPage = 0,
  menuItems = [],
  isActive,
  setActive,
  bookCardClickHandler,
}) => {
  const { coverImg, authors, title, pageCount = 0 } = book;
  const { username, profilePic } = user;
  const formattedDueDate = dueDate ? dayMonthFormat(dueDate) : null;

  const readingProgress =
    currentPage === 0 || pageCount === 0
      ? 0
      : getProgressInPercent(currentPage, pageCount);

  return (
    <div className={styles.container}>
      {!isActive && menuItems.length !== 0 && (
        <div className={styles.menuBtn} onClick={() => setActive(userCard_id)}>
          <FontAwesomeIcon icon={faBars} size="lg" />
        </div>
      )}
      <div
        className={styles.imgContainer}
        onClick={() => bookCardClickHandler()}
      >
        <img
          src={coverImg}
          alt={title}
          className={styles.coverImg}
          referrerPolicy="no-referrer"
        />
      </div>
      <div className={styles.body}>
        <h5 className={styles.title}>{title}</h5>
        <h6 className={styles.subTitle}>{authors[0]}</h6>

        <Avatar imgSrc={profilePic} username={username} />
        {username}
        <dl className={styles.dueDate}>
          <dt>Due Date:</dt>
          <dd>{formattedDueDate}</dd>
        </dl>

        {readingProgress !== 0 && (
          <div className={styles.progressContainer}>
            <small>
              Reading Progress: {currentPage} of {pageCount}
            </small>
            <ProgressBar value={readingProgress} className={styles.progress} />
          </div>
        )}
      </div>
      {isActive && menuItems.length !== 0 && (
        <div className={styles.menu}>
          <div
            className={styles.menuClose}
            onClick={() => {
              setActive("");
            }}
          >
            <FontAwesomeIcon icon={faClose} />
          </div>
          <div className={styles.menuItems}>
            <BookMenuModal
              isActive={isActive}
              setActive={setActive}
              menuItems={menuItems}
              bookData={{ book, user, dueDate, currentPage }}
              userCard_id={userCard_id}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserBookCardLrg;
