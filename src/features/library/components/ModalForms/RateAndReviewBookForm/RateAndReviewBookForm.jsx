import { useSelector } from "react-redux";
import { selectUserRatingForBook } from "../../../../Ratings/RatingsSlice";
import { useState } from "react";
import { StarRating } from "../../../../Ratings/components";
import { BaseForm } from "../BookModalForm/BookModalForm";
import styles from "./RateAndReviewBookForm.module.scss";

const RateAndReviewBookForm = ({
  userBook,
  onClose,
  isSubmitting,
  error,
  onConfirm,
}) => {
  const rating = useSelector((state) =>
    selectUserRatingForBook(state, userBook.book._id)
  );
  const [values, setValues] = useState({
    rating: userBook.rating,
    review: rating?.review || "",
  });
  const handleChange = (newRating) => {
    setValues({ ...values, rating: newRating });
  };

  const handleConfirm = async () => {
    const ratingAndReview = { rating: values.rating, review: values.review };
    if (rating) {
      return await onConfirm.updateBookRating(rating._id, ratingAndReview);
    } else {
      return await onConfirm.rateBook(userBook.book._id, ratingAndReview);
    }
  };

  return (
    <div>
      <div className={styles.ratingContainer}>
        <StarRating
          value={values.rating}
          onChange={handleChange}
          interactive={true}
        />
        <textarea
          value={values.review}
          onChange={(e) => {
            setValues({ ...values, review: e.target.value });
          }}
          placeholder="Write a review"
        />
      </div>
      <BaseForm
        confirmationMsg=""
        successMessage={
          rating ? "Rating updated successfully" : "Book rated successfully"
        }
        buttonText="Rate"
        onConfirm={handleConfirm}
        onClose={onClose}
        isSubmitting={isSubmitting}
        error={error}
      />
    </div>
  );
};

export default RateAndReviewBookForm;
