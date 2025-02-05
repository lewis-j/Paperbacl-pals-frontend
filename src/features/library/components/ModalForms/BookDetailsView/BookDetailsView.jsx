import { useSelector } from "react-redux";
import * as asyncStatus from "../../../../../data/asyncStatus";
import { Button, Loading } from "../../../../../components";
import { selectUserRatingForBook } from "../../../../../features/Ratings/RatingsSlice";
import styles from "./BookDetailsView.module.scss";
import { StarRating } from "../../../../Ratings/components";
import { useModal } from "../../../../../context/ModalContext";
import { useNavigate } from "react-router-dom";

const BookDetailsView = ({ userBook }) => {
  const { modalActions } = useModal();
  const navigate = useNavigate();
  const userBookAsyncStatus = useSelector((state) => state.userBooks.status);
  const existingRating = useSelector((state) =>
    selectUserRatingForBook(state, userBook?.book?._id)
  );

  console.log("existingRating", existingRating);

  const rating = existingRating?.rating || userBook.book.averageRating;

  const handleRatingChange = (newRating) => {
    modalActions.rateAndReviewBook(userBook, newRating);
  };

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
        </div>
        <div className={styles.headerDetails}>
          <div className={styles.details}>
            <h3 className={styles.title}>{userBook.book.title}</h3>
            <p className={styles.authors}>{userBook.book.authors.join(", ")}</p>
          </div>
          <div className={styles.ratingContainer}>
            <StarRating
              value={rating}
              onChange={handleRatingChange}
              interactive={true}
            />
            <p className={styles.ratingCount}>
              ({userBook.book.numberOfRatings})
            </p>
          </div>
          <button
            className={styles.editRatingButton}
            onClick={() => modalActions.rateAndReviewBook(userBook, rating)}
          >
            {existingRating ? "Edit Rating" : "Rate book"}
          </button>
          {userBook?.sender && (
            <div className={styles.userDetails}>
              <img
                src={userBook?.sender?.profilePic}
                alt={userBook?.sender.username}
              />
              <div>{userBook?.sender?.username}</div>
            </div>
          )}
        </div>
      </div>
      <div className={styles.descriptionContainer}>
        <h6 className={styles.descriptionTitle}>Description</h6>
        <p className={styles.description}>{userBook.book.description}</p>
      </div>
      <div className={styles.moreDetailsWrapper}>
        <Button
          className={styles.closeButton}
          onClick={() => navigate(`/app/book-details/${userBook.book._id}`)}
        >
          More details
        </Button>
      </div>
    </div>
  );
};

export default BookDetailsView;
