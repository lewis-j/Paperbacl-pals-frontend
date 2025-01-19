import { useSelector } from "react-redux";
import * as asyncStatus from "../../../../../data/asyncStatus";
import { Button, Loading } from "../../../../../components";
import { selectUserRatingForBook } from "../../../../../features/Ratings/RatingsSlice";
import styles from "./BookDetailsView.module.scss";
import { StarRating } from "../../../../Ratings/components";

const BookDetailsView = ({ userBook, onClose, isSubmitting }) => {
  const userBookAsyncStatus = useSelector((state) => state.userBooks.status);
  const existingRating = useSelector((state) =>
    selectUserRatingForBook(state, userBook?.book?._id)
  );

  if (!userBook) return null;
  if (userBookAsyncStatus === asyncStatus.LOADING) return <Loading />;

  return (
    <div className={styles.bookDetailsContainer}>
      <div className={styles.bookHeader}>
        <div className={styles.bookCard}>
          <div className={styles.ratingContainer}>
            <div className={styles.imgContainer}>
              <img
                src={userBook.book.coverImg}
                alt={userBook.book.title}
                className={styles.coverImg}
                referrerPolicy="no-referrer"
              />
            </div>
            <StarRating
              value={existingRating?.rating || userBook.book.averageRating}
              interactive={true}
            />
            <p className={styles.ratingCount}>
              ({userBook.book.numberOfRatings})
            </p>
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
