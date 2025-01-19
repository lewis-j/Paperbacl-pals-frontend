import * as ratingsAPI from "./RatingsApi";

export const rateBook = async ({ bookId, rating }) => {
  try {
    const response = await ratingsAPI.rateBook({ bookId, rating });
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const updateRating = async ({ ratingId, rating }) => {
  try {
    const response = await ratingsAPI.updateRating({
      ratingId,
      rating,
    });
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};
