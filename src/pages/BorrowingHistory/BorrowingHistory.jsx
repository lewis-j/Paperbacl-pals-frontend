import React, { useEffect, useState } from "react";
import { BookContainer, UserBookCardSm } from "../../features/library";
import { Col } from "../../lib/BootStrap";
import { useSelector } from "react-redux";
import styles from "./BorrowingHistory.module.scss";
import { useDispatch } from "react-redux";
import { fetchReturnedBooks } from "../../features/library/userBooksSlice";
import { PageLoading } from "../../components";
import { useLibraryModalManager } from "../../features/library/hooks/useLibraryModalManager";

const BorrowingHistory = () => {
  const borrowedBooks = useSelector(
    (state) => state.userBooks?.books?.returnedBooks?.borrowedBooks ?? null
  );
  const dispatch = useDispatch();
  const [activeCardId, setActiveCardId] = useState("");
  const { menuItems, renderModal } = useLibraryModalManager(setActiveCardId);

  const bookHistoryMenuItems = menuItems.bookHistory;

  useEffect(() => {
    if (!borrowedBooks) {
      dispatch(fetchReturnedBooks())
        .unwrap()
        .catch((error) => console.error(error));
    }
  }, [borrowedBooks, dispatch]);

  const mapCheckedOutBooks = (borrowedBook, i) => {
    const { book, owner, request } = borrowedBook;
    const borrowedBookSnapshot = { ...borrowedBook };
    const menuItems = bookHistoryMenuItems(borrowedBookSnapshot);
    const BookCol = ({ children, key }) => (
      <Col sm="4" md="3" xl="2" className="mb-3" key={key}>
        {children}
      </Col>
    );
    return (
      <BookCol key={`LibraryCard:${borrowedBook._id}-${i}`}>
        <UserBookCardSm
          _id={request._id}
          book={book}
          user={owner}
          isActive={activeCardId === request._id}
          setActive={setActiveCardId}
          menuItems={menuItems}
        />
      </BookCol>
    );
  };

  if (!borrowedBooks) {
    return <PageLoading />;
  }
  return (
    <div>
      {renderModal()}
      <h1 className={styles.title}>Borrowed Books History</h1>
      <div className={styles.bookwrapper}>
        <BookContainer>
          {borrowedBooks.map((userBook, i) => mapCheckedOutBooks(userBook, i))}
        </BookContainer>
      </div>
    </div>
  );
};

export default BorrowingHistory;
