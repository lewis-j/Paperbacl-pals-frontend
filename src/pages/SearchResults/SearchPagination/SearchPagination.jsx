import React, { useState } from "react";
import { Pagination, PaginationItem, PaginationLink } from "reactstrap";
import styles from "./SearchPagination.module.scss";
import "./SearchPagination.scss";
import { useBSSizeFromWidth } from "../../../utilities/getBSSizeFromWidth";
import { useDispatch, useSelector } from "react-redux";
import { getMoreBooks } from "../../../features/search";

const SearchPagination = ({ setCurrentPage, currentPage }) => {
  const reactstrapBreakPointSize = useBSSizeFromWidth();
  const { bookResults } = useSelector((state) => state.searchResults);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const itemsPerPage = 12;
  const pages = bookResults.results.length;
  const totalResults = bookResults.total;
  const totalPages = Math.ceil(totalResults / itemsPerPage);

  const checkForAvailableBooks = async (pageNum) => {
    if (pages - 1 < pageNum) {
      setIsLoading(true);
      try {
        // Calculate how many more sets of 36 books we need
        const neededBooks = (pageNum + 1) * itemsPerPage;
        const currentBooks = pages * itemsPerPage;
        const booksToFetch = neededBooks - currentBooks;
        const calls = Math.ceil(booksToFetch / 36);

        // Fetch books sequentially to maintain order
        for (let i = 0; i < calls; i++) {
          const startIndex = pages * itemsPerPage + i * 36;
          await dispatch(getMoreBooks({ startIndex })).unwrap();
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  const resetToTop = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto", // 'auto' instead of 'smooth' for instant jump
    });
  };

  const renderNewPage = async (item) => {
    resetToTop();
    await checkForAvailableBooks(item);
    setCurrentPage(item);
  };

  const nextPage = async () => {
    if (currentPage < totalPages - 1) {
      resetToTop();
      await checkForAvailableBooks(currentPage + 1);
      setCurrentPage((prev) => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      resetToTop();
      setCurrentPage((prev) => prev - 1);
    }
  };

  const getPageNumbers = () => {
    const totalButtons = 10; // We want 10 number buttons
    let pageNumbers = [];

    if (currentPage < totalButtons) {
      // If we're in the first 10 pages, show 1-10
      pageNumbers = [...Array(Math.min(totalButtons, totalPages)).keys()];
    } else {
      // Always include page 1, then show current page and surrounding pages
      pageNumbers = [0]; // Page 1

      // Calculate start page (leaving room for page 1)
      const remainingButtons = totalButtons - 1; // -1 for page 1
      const start = Math.min(
        currentPage - Math.floor(remainingButtons / 2),
        totalPages - remainingButtons
      );

      // Add the range of pages
      for (let i = 0; i < remainingButtons; i++) {
        pageNumbers.push(start + i);
      }
    }

    return pageNumbers;
  };

  const renderedPaginationItems = getPageNumbers().map((pageNum) => (
    <PaginationItem
      key={pageNum}
      active={currentPage === pageNum}
      disabled={isLoading}
    >
      <PaginationLink
        className={styles.paginationLink}
        tag="div"
        onClick={() => !isLoading && renderNewPage(pageNum)}
      >
        {pageNum + 1}
      </PaginationLink>
    </PaginationItem>
  ));

  return (
    <div className={styles.container}>
      <Pagination
        aria-label="Page navigation for Search"
        size={reactstrapBreakPointSize}
      >
        <PaginationItem disabled={currentPage === 0 || isLoading}>
          <PaginationLink
            className={styles.paginationLink}
            tag="div"
            onClick={prevPage}
            previous
          />
        </PaginationItem>
        {renderedPaginationItems}
        <PaginationItem disabled={currentPage === totalPages - 1 || isLoading}>
          <PaginationLink
            tag="div"
            onClick={nextPage}
            next
            className={styles.paginationLink}
          />
        </PaginationItem>
      </Pagination>
    </div>
  );
};

export default SearchPagination;
