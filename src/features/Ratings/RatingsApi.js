import API from "../../lib/authAxios";

export const rateBook = async ({ bookId, rating }) => {
  console.log("rateBook", bookId, rating);
  try {
    const response = await API.post(`/ratings/books/${bookId}`, { rating });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateRating = async ({ ratingId, rating }) => {
  try {
    const response = await API.patch(`/ratings/books/${ratingId}`, { rating });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
