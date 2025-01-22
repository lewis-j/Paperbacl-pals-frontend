import { useDispatch, useSelector } from "react-redux";
import { UserBookCardSm, BookContainer } from "../../features/library";
import styles from "./BorrowedPage.module.scss";
import { faUserGroup } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { nextBookRequestStatus } from "../../features/library/userBookCalls";
import { useBookSelectors } from "../../features/library/hooks/useBookSelectors";
import BookTransferTracker from "../../features/library/components/BookTransferTracker/BookTransferTracker";
import { Col, Container } from "../../lib/BootStrap";
import { useState } from "react";
import { useLibraryModalManager } from "../../features/library/hooks/useLibraryModalManager";

const BorrowedPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeCardId, setActiveCardId] = useState("");
  const { menuItems, runAction, renderModal, modalActions } =
    useLibraryModalManager(setActiveCardId);
  const isBorrower = true;

  const {
    borrowedBookRequests: pendingBooks,
    allBooksFromFriends: checkedOutBooks,
    borrowedbooksInTransition,
  } = useBookSelectors(useSelector((state) => state.userBooks));

  const checkedOutBookMenuitems = menuItems.booksFromFriends;
  const pendingBookMenuitems = menuItems.borrowedBookRequests;
  const createRenderBooksWithMenuItems = (menuItems) => {
    const RenderBook = (userBook) => {
      const { _id, book, owner, dueDate, currentPage } = userBook;

      const userBookSnapshot = { ...userBook };

      return (
        <Col sm="4" md="3" xl="2" className="mb-3" key={`LibraryCard:${_id}`}>
          <UserBookCardSm
            _id={_id}
            book={book}
            user={owner}
            dueDate={dueDate}
            currentPage={currentPage}
            setActive={setActiveCardId}
            isActive={activeCardId === _id}
            menuItems={menuItems(userBookSnapshot)}
            bookCardClickHandler={() =>
              modalActions.viewUserBookDetails(userBookSnapshot)
            }
          />
        </Col>
      );
    };
    RenderBook.displayName = "RenderBook";
    return RenderBook;
  };

  const handleConfirmPickup = async (requestId) => {
    // API call to confirm book pickup

    dispatch(nextBookRequestStatus(requestId));
  };

  const handleConfirmDropoff = async (requestId) => {
    // API call to confirm book dropoff

    dispatch(nextBookRequestStatus(requestId));
  };

  const borrowedBooksNoContent = {
    text: "No books Yet!",
    description: "Check your Friends library to start borrowing books!",
    buttonText: "Friends",
    buttonIcon: faUserGroup,
    onClick: () => navigate("../friends"),
  };

  return (
    <>
      {renderModal()}
      <Container className={styles.container}>
        <BookTransferTracker
          booksInTransition={borrowedbooksInTransition}
          onConfirmPickup={handleConfirmPickup}
          onConfirmDropoff={handleConfirmDropoff}
          runAction={runAction(isBorrower)}
          isBorrower={isBorrower}
        />
        <div className={styles.title}>
          <h1>Borrowed Library</h1>
        </div>
        <div>
          <h4 className={styles.subtitle}>Borrowing</h4>
        </div>

        <BookContainer noContent={borrowedBooksNoContent}>
          {checkedOutBooks.map(
            createRenderBooksWithMenuItems(checkedOutBookMenuitems)
          )}
        </BookContainer>

        <div>
          <h4 className={styles.subtitle}>Pending Books</h4>
        </div>

        <BookContainer noContent={borrowedBooksNoContent}>
          {pendingBooks.map(
            createRenderBooksWithMenuItems(pendingBookMenuitems)
          )}
        </BookContainer>
      </Container>
    </>
  );
};

BorrowedPage.displayName = "BorrowedPage";

export default BorrowedPage;
