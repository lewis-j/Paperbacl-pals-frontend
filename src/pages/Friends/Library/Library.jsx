import { useState } from "react";
import { useSelector } from "react-redux";
import {
  UserBookCardSm,
  BookCard,
  BookContainer,
  bookRequestStatus,
  UserBookCardLrg,
} from "../../../features/library";
import { upperFirst } from "../../../utilities/stringUtil";
import styles from "./Library.module.scss";
import { Badge } from "../../../components";
import { useLibraryModalManager } from "../../../features/library/hooks/useLibraryModalManager";
import BookCardBadge from "../../../features/library/components/BookCards/BookCardBadge/BookCardBadge";
import { Col } from "../../../lib/BootStrap";
import { useFriendsBooksSelector } from "../../../features/library/hooks/useFriendsBooksSelector";

const Library = () => {
  const currentFriend = useSelector((state) => state.friends.currentFriend);
  const currentUser = useSelector((state) => state.authUser.currentUser);
  const { username } = currentFriend;

  const [activeCardId, setActiveCardId] = useState("");
  const { menuItems, renderModal } = useLibraryModalManager(setActiveCardId);

  const { booksInLibrary: checkedInBooks, booksToFriends: checkedOutBooks } =
    useFriendsBooksSelector();

  // const checkedOutMenuItems = menuItems.booksToFriends(checkedOutBooks);

  const filterRequest = (userBook) => {
    const { requests } = userBook;
    const foundRequest = requests.find(
      (req) => req.sender._id === currentUser._id
    );
    const _userBook = { ...userBook, request: foundRequest };

    switch (foundRequest?.status) {
      case bookRequestStatus.CHECKED_IN:
        return {
          menu: menuItems.borrowedBookRequests(_userBook),
          badge: <Badge.RequestBadge />,
        };
      case bookRequestStatus.CHECKED_OUT:
        return {
          menu: menuItems.booksFromFriends(_userBook),
          badge: <Badge.LibraryBadge />,
        };
      default:
        return {
          menu: menuItems.friendsBooks(_userBook),
          badge: null,
        };
    }
  };

  const BookCol = ({ children, key }) => (
    <Col sm="6" md="4" lg="3" xl="2" className="mb-3" key={key}>
      {children}
    </Col>
  );

  const renderCurrentRead = (userBook) => {
    console.log("userBook in renderCurrentRead", userBook);
    const { _id, book, owner, requests } = userBook;
    const currentRequest = requests.find(
      (req) => req.sender._id === currentFriend._id
    );
    console.log("currentRequest", userBook.requests, currentFriend._id);
    if (!currentRequest) return null;

    const { currentPage, dueDate } = currentRequest;

    return (
      <UserBookCardLrg
        _id={_id}
        book={book}
        user={owner}
        dueDate={dueDate}
        currentPage={currentPage}
        isActive={activeCardId === _id}
        setActive={setActiveCardId}
        menuItems={menuItems}
      />
    );
  };

  const renderCheckedOutUserBookCard = (userBook, i) => {
    const { _id, book, dueDate, currentPage, sender } = userBook;

    const { menu, badge } = filterRequest(userBook);
    return (
      <BookCol key={`UserBookCardSm:${_id}`}>
        <BookCardBadge badge={badge}>
          <UserBookCardSm
            _id={_id}
            book={book}
            user={sender}
            dueDate={dueDate}
            menuItems={menu}
            currentPage={currentPage}
            setActive={setActiveCardId}
            isActive={activeCardId === _id}
          />
        </BookCardBadge>
      </BookCol>
    );
  };

  const renderCheckedInBookCards = (userBooks) => {
    return userBooks.map((userBook) => {
      const { _id, book } = userBook;
      const { menu, badge } = filterRequest(userBook);
      const { coverImg, title } = book;

      return (
        <BookCol key={`BookCards:${_id}`}>
          <BookCard
            menuItems={menu}
            book={{ coverImg, title }}
            _id={_id}
            setActive={setActiveCardId}
            isActive={activeCardId === _id}
            badge={badge}
          />
        </BookCol>
      );
    });
  };

  return (
    <>
      <div className="container">
        {renderModal()}
        <div className={styles.title}>
          <h1>{`${upperFirst(username)}'s Library`}</h1>
        </div>
        {currentFriend?.currentRead && (
          <div>
            <h4>Current read</h4>
            <div>{renderCurrentRead(currentFriend.currentRead)}</div>
          </div>
        )}
        <div>
          <h4 className={styles.subtitle}>Checked in Books</h4>
        </div>
        <div className={styles.section}>
          <BookContainer>
            {renderCheckedInBookCards(checkedInBooks)}
          </BookContainer>
        </div>
        <div>
          <h4 className={styles.subtitle}>Checked Out Books</h4>
        </div>
        <div className={styles.section}>
          <BookContainer>
            {checkedOutBooks.map(renderCheckedOutUserBookCard)}
          </BookContainer>
        </div>
      </div>
    </>
  );
};

export default Library;
