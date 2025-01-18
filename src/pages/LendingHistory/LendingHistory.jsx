import { useEffect, useState } from "react";
import { BookContainer, UserBookCardSm } from "../../features/library";
import { Col } from "../../lib/BootStrap";
import { useSelector } from "react-redux";
import styles from "./LendingHistory.module.scss";
import { useDispatch } from "react-redux";
import { fetchReturnedBooks } from "../../features/library/userBooksSlice";
import { PageLoading } from "../../components";
import { useLibraryModalManager } from "../../features/library/hooks/useLibraryModalManager";

const LendingHistory = () => {
  const lentBooks = useSelector(
    (state) => state.userBooks?.books?.returnedBooks?.lentBooks ?? null
  );
  const dispatch = useDispatch();
  const [activeCardId, setActiveCardId] = useState("");
  const { menuItems, renderModal } = useLibraryModalManager(setActiveCardId);

  const bookHistoryMenuItems = menuItems.bookHistory;

  useEffect(() => {
    if (!lentBooks) {
      dispatch(fetchReturnedBooks())
        .unwrap()
        .catch((error) => console.error(error));
    }
  }, [lentBooks, dispatch]);

  const mapLentBooks = (lentBook, i) => {
    console.log("lentBook", lentBook);

    const { _id, sender } = lentBook;
    const { book } = lentBook.userBook;
    const request = { status: lentBook.status };
    const lentBookSnapshot = { ...lentBook, request, book, isBorrower: false };
    const menuItems = bookHistoryMenuItems(lentBookSnapshot);
    return (
      <Col
        sm="4"
        md="3"
        xl="2"
        className="mb-3"
        key={`LibraryCard:${lentBook._id}-${i}`}
      >
        <UserBookCardSm
          _id={_id}
          book={book}
          user={sender}
          isActive={activeCardId === _id}
          setActive={setActiveCardId}
          menuItems={menuItems}
        />
      </Col>
    );
  };

  if (!lentBooks) {
    return <PageLoading />;
  }
  return (
    <div>
      {renderModal()}
      <h1 className={styles.title}>Lent Books History</h1>
      <div className={styles.bookwrapper}>
        <BookContainer>
          {lentBooks.map((userBook, i) => mapLentBooks(userBook, i))}
        </BookContainer>
      </div>
    </div>
  );
};

export default LendingHistory;
