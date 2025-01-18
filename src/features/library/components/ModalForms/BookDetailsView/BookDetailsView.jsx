import { useSelector } from "react-redux";
import * as asyncStatus from "../../../../../data/asyncStatus";
import { Button, Loading } from "../../../../../components";
import styles from "./BookDetailsView.module.scss";

const BookDetailsView = ({ userBook, onClose, isSubmitting }) => {
  const userBookAsyncStatus = useSelector((state) => state.userBooks.status);

  if (!userBook) return null;
  if (userBookAsyncStatus === asyncStatus.LOADING) return <Loading />;

  return (
    <div className={styles.bookDetailsContainer}>
      <div className={styles.bookHeader}>
        <div className={styles.bookCard}>
          <div className={styles.imgContainer}>
            <img
              src={userBook.book.coverImg}
              alt={userBook.book.title}
              className={styles.coverImg}
              referrerPolicy="no-referrer"
            />
          </div>
          <div className={styles.details}>
            <h3 className={styles.title}>{userBook.book.title}</h3>
            <p className={styles.authors}>{userBook.book.authors.join(", ")}</p>
            <p className={styles.description}>{userBook.book.description}</p>
            <div className={styles.buttonContainer}>
              <Button
                variant="cancel"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailsView;
