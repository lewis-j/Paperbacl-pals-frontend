export const processBookResults = (bookInfo) => {
  return {
    ...bookInfo,
    title: bookInfo?.title || ["unknown"],
    authors: bookInfo?.authors || ["unknown"],
    thumbnail: bookInfo?.imageLinks?.thumbnail || null,
    description: bookInfo?.description || "no description",
    pageCount: bookInfo?.pageCount || 0,
  };
};

export const getProgressInPercent = (currentPage, pageCount) => {
  if (pageCount === 0) return 0;
  return (currentPage / pageCount) * 100;
};
