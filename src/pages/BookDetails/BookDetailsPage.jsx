import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import * as asyncStatus from "../../data/asyncStatus";
import { Loading } from "../../components";
import {
  getBookRatings,
  selectBookRatings,
  selectUserRatingForBook,
} from "../../features/Ratings/RatingsSlice";
import styles from "./BookDetailsPage.module.scss";
import { StarRating } from "../../features/Ratings/components";
import { selectBookById } from "../../features/library/userBooksSlice";
import { useEffect } from "react";
// import { useLibraryModalManager } from "../../features/library/hooks/useLibraryModalManager";

const BookDetailsPage = () => {
  const { bookId } = useParams();
  // const { modalActions } = useLibraryModalManager();
  const dispatch = useDispatch();
  const userBook = useSelector((state) => selectBookById(state, bookId));
  const userBookAsyncStatus = useSelector((state) => state.userBooks.status);
  const existingRating = useSelector((state) =>
    selectUserRatingForBook(state, bookId)
  );
  const bookRatings = useSelector((state) => selectBookRatings(state, bookId));

  console.log("bookRatings", bookRatings);

  useEffect(() => {
    dispatch(getBookRatings({ bookId }));
  }, [dispatch, bookId]);

  const rating = existingRating?.rating || userBook?.book?.averageRating;

  const handleRatingChange = (newRating) => {
    console.log(newRating);
    //need to find associated userBook to open
    //   modalActions.rateAndReviewBook()
  };

  const renderReviews = (ratings) => {
    const reviewsWithContent = ratings.filter(
      (rating) => rating.review && rating.review.trim() !== ""
    );

    if (reviewsWithContent.length === 0) {
      return (
        <div className={styles.noReviews}>
          <p>No written reviews yet. Be the first to review this book!</p>
        </div>
      );
    }

    return reviewsWithContent.map((rating) => (
      <div key={rating._id} className={styles.reviewCard}>
        <div className={styles.reviewHeader}>
          <span className={styles.reviewUser}>{rating.user.username}</span>
          <StarRating value={rating.rating} interactive={false} />
          <span className={styles.reviewDate}>
            {new Date(rating.createdAt).toLocaleDateString()}
          </span>
        </div>
        <p className={styles.reviewText}>{rating.review}</p>
      </div>
    ));
  };

  if (!userBook) return null;
  if (userBookAsyncStatus === asyncStatus.LOADING) return <Loading />;

  return (
    <div className={styles.pageContainer}>
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
              <h1 className={styles.title}>{userBook.book.title}</h1>
              <p className={styles.authors}>
                {userBook.book.authors.join(", ")}
              </p>
            </div>
            <div className={styles.ratingContainer}>
              <StarRating
                value={rating}
                onChange={handleRatingChange}
                interactive={false}
              />
              <p className={styles.ratingCount}>
                ({userBook.book.numberOfRatings})
              </p>
            </div>
            {/* <button
              className={styles.editRatingButton}
              onClick={() => handleRatingChange(rating)}
            >
              {existingRating ? "Edit Rating" : "Rate book"}
            </button> */}
          </div>
        </div>

        <div className={styles.descriptionContainer}>
          <h2 className={styles.sectionTitle}>Description</h2>
          <p className={styles.description}>{userBook.book.description}</p>
        </div>

        <div className={styles.reviewsSection}>
          <h2 className={styles.sectionTitle}>Reviews</h2>
          <div className={styles.reviewsList}>{renderReviews(bookRatings)}</div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailsPage;
