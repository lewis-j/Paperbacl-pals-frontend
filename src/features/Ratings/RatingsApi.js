import API from "../../lib/authAxios";

export const getUsersBookRatings = async () => {
  try {
    const response = await API.get("/ratings/books/user");
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getBookRatings = async ({ bookId }) => {
  try {
    const response = await API.get(`/ratings/books/${bookId}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const rateBook = async ({ bookId, ratingAndReview }) => {
  console.log("rateBook", bookId, ratingAndReview);
  try {
    const response = await API.post(
      `/ratings/books/${bookId}`,
      ratingAndReview
    );
    console.log("response in rateBook", response.data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateRating = async ({ ratingId, ratingAndReview }) => {
  try {
    const response = await API.patch(
      `/ratings/books/${ratingId}`,
      ratingAndReview
    );
    console.log("response in updaterating", response.data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
