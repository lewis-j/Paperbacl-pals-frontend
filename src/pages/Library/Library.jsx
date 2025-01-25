import {
  BookCard,
  UserBookCardSm,
  BookTransferTracker,
  RequestBadge,
  BookCardBadge,
} from "../../features/library";
import styles from "./Library.module.scss";
import { useBookSelectors } from "../../features/library/hooks/useBookSelectors";
import { useSelector } from "react-redux";
import { Badge, Button } from "../../components";
import requestStatus from "../../data/requestStatus";
import { Col, Container } from "../../lib/BootStrap";
import { useState, useCallback } from "react";
import { useLibraryModalManager } from "../../features/library/hooks/useLibraryModalManager";
import { useSearchModal } from "../../features/search/hooks/useSearchModal";
import { LibrarySection } from "../../features/library/components";

const Library = () => {
  const [activeCardId, setActiveCardId] = useState("");
  const [filteredLibraryBooks, setFilteredLibraryBooks] = useState(null);
  const [filteredCheckedOutBooks, setFilteredCheckedOutBooks] = useState(null);
  const { menuItems, runAction, renderModal, modalActions } =
    useLibraryModalManager(setActiveCardId);
  const { renderSearchModal, openSearchModal } = useSearchModal();
  const isBorrower = false;

  const { booksInLibrary, booksToFriends, ownedbooksInTransition } =
    useBookSelectors(useSelector((state) => state.userBooks));

  const toFriendsMenuItems = menuItems.booksToFriends;
  const inLibraryMenuItems = menuItems.booksInLibrary;
  const bookRequestMenuItems = menuItems.bookRequests;

  const BookCol = ({ children, key }) => (
    <Col sm="4" md="3" xl="2" className="mb-3" key={key}>
      {children}
    </Col>
  );

  const mapCheckedOutBooks = (userBook) => {
    const { _id, book, sender, dueDate, currentPage } = userBook;
    const { request } = userBook;
    const bookCardBadge = { badge: null, clickHandler: () => {} };
    const userBookSnapShot = { ...userBook };
    const toFriendsmenuItems = toFriendsMenuItems(userBookSnapShot);
    const cancelReturnRequest = toFriendsmenuItems[2].clickHandler;
    if (request.status === requestStatus.RETURN_REQUESTED) {
      bookCardBadge.badge = <Badge.ReturnRequestedBadge />;
      bookCardBadge.clickHandler = () => {
        cancelReturnRequest();
      };
    }
    return (
      <BookCol key={`LibraryCard:${userBook._id}`}>
        <BookCardBadge
          badge={bookCardBadge.badge}
          clickHandler={bookCardBadge.clickHandler}
        >
          <UserBookCardSm
            _id={_id}
            book={book}
            menuItems={toFriendsmenuItems}
            user={sender}
            dueDate={dueDate}
            currentPage={currentPage}
            setActive={setActiveCardId}
            isActive={activeCardId === _id}
            bookCardClickHandler={() =>
              modalActions.viewUserBookDetails(userBookSnapShot)
            }
          />
        </BookCardBadge>
      </BookCol>
    );
  };

  const renderCheckedInBookCard = (userBook) => {
    const { _id, book, status } = userBook;
    const cardInfo = { ...book, status };
    const checkedInMenuItems = (userBook) => {
      if (userBook.requests.length > 0) {
        return bookRequestMenuItems(userBook);
      } else {
        return inLibraryMenuItems(userBook);
      }
    };
    const badgeOnClick = bookRequestMenuItems(userBook)[0].clickHandler;

    const requestCount = userBook.requests.filter(
      (request) => request.status !== requestStatus.RETURNED
    ).length;

    const userBookSnapshot = { ...userBook };

    return (
      <Col sm="4" md="3" xl="2" className="mb-3" key={_id}>
        <RequestBadge
          count={requestCount}
          clickHandler={() => {
            badgeOnClick();
          }}
        >
          <BookCard
            _id={_id}
            book={cardInfo}
            menuItems={checkedInMenuItems(userBookSnapshot)}
            isActive={activeCardId === _id}
            setActive={setActiveCardId}
            bookCardClickHandler={() =>
              modalActions.viewUserBookDetails(userBookSnapshot)
            }
          />
        </RequestBadge>
      </Col>
    );
  };

  const handleBookSearch = useCallback((input, books, setFilteredBooks) => {
    if (!input.trim()) {
      setFilteredBooks(null);
      return;
    }

    const filteredBooks = books.filter((userbook) => {
      const searchTerm = input.toLowerCase();
      return (
        userbook.book.title.toLowerCase().includes(searchTerm) ||
        userbook.book.authors.some((author) =>
          author.toLowerCase().includes(searchTerm)
        )
      );
    });
    setFilteredBooks(filteredBooks);
  }, []);

  const handleLibrarySearch = useCallback(
    (input) => {
      handleBookSearch(input, booksInLibrary, setFilteredLibraryBooks);
    },
    [booksInLibrary, handleBookSearch]
  );

  const handleCheckedOutSearch = useCallback(
    (input) => {
      handleBookSearch(input, booksToFriends, setFilteredCheckedOutBooks);
    },
    [booksToFriends, handleBookSearch]
  );

  return (
    <>
      {renderSearchModal("books")}
      {renderModal()}
      <Container className={styles.container}>
        <div className={styles.libraryHeader}>
          <div className={styles.title}>
            <h1>Your Library</h1>
          </div>
          <Button onClick={() => openSearchModal()} variant="primary" size="sm">
            Add Book
          </Button>
        </div>

        <LibrarySection
          title="Checked in Books"
          books={booksInLibrary}
          filteredBooks={filteredLibraryBooks}
          renderBook={renderCheckedInBookCard}
          searchPlaceholder="Search Checked In Books"
          onSearch={handleLibrarySearch}
          noContent={{
            text: "No Books in Library",
            description: "Add some books to get started!",
            buttonText: "Add Book",
            onClick: () => openSearchModal(),
          }}
        />

        <BookTransferTracker
          booksInTransition={ownedbooksInTransition}
          isBorrower={isBorrower}
          runAction={runAction(isBorrower)}
        />

        <LibrarySection
          title="Checked Out Books"
          books={booksToFriends}
          filteredBooks={filteredCheckedOutBooks}
          renderBook={mapCheckedOutBooks}
          searchPlaceholder="Search Checked Out Books"
          onSearch={handleCheckedOutSearch}
          noContent={{
            text: "No Checked Out Books",
            description: "Share books with friends to see them here",
          }}
        />
      </Container>
    </>
  );
};

export default Library;
