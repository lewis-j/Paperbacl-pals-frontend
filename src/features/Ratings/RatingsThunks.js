import * as ratingsAPI from "./RatingsApi";

export const getUsersBookRatings = async () => {
  try {
    const response = await ratingsAPI.getUsersBookRatings();
    return response;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getBookRatings = async ({ bookId }) => {
  try {
    const response = await ratingsAPI.getBookRatings({ bookId });
    return { ratings: response, bookId };
  } catch (error) {
    return Promise.reject(error);
  }
};

export const rateBook = async ({ bookId, ratingAndReview }) => {
  try {
    const response = await ratingsAPI.rateBook({ bookId, ratingAndReview });
    return response;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const updateRating = async ({ ratingId, ratingAndReview }) => {
  try {
    const response = await ratingsAPI.updateRating({
      ratingId,
      ratingAndReview,
    });
    return response;
  } catch (error) {
    return Promise.reject(error);
  }
};
