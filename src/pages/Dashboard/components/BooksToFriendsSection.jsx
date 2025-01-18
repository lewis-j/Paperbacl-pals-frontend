import React from "react";
import { Badge, ResponsiveSlider } from "../../../components";
import { BookCardBadge, UserBookCardSm } from "../../../features/library";
import EmptyStatePrompt from "./EmptyStatePrompt/EmptyStatePrompt";
import styles from "../DashboardPage.module.scss";
import requestStatus from "../../../data/requestStatus";

const BooksToFriendsSection = ({
  books,
  activeCard,
  setActiveCard,
  menuItems,
}) => {
  const renderBook = (userBook) => {
    const {
      _id,
      book,
      sender, // The friend who borrowed the book
      dueDate,
      currentPage,
    } = userBook;
    const { request } = userBook;
    const bookCardBadge = { badge: null, clickHandler: () => {} };
    const userBookSnapshot = { ...userBook };
    const toFriendsmenuItems = menuItems(userBookSnapshot);
    const cancelReturnRequest = toFriendsmenuItems[2].clickHandler;
    if (request.status === requestStatus.RETURN_REQUESTED) {
      bookCardBadge.badge = <Badge.ReturnRequestedBadge />;
      bookCardBadge.clickHandler = () => {
        cancelReturnRequest();
      };
    }
    return (
      <div key={`${_id}-${request.status}-${dueDate}`}>
        <BookCardBadge
          badge={bookCardBadge.badge}
          clickHandler={bookCardBadge.clickHandler}
        >
          <UserBookCardSm
            key={_id}
            _id={_id}
            book={book}
            user={sender}
            dueDate={dueDate}
            currentPage={currentPage}
            setActive={setActiveCard}
            isActive={activeCard === _id}
            menuItems={toFriendsmenuItems}
          />
        </BookCardBadge>
      </div>
    );
  };

  const renderContent = () => {
    if (books.length === 0) {
      return (
        <EmptyStatePrompt
          title="Check Library"
          route="library"
          text="You currently have no checked out books"
        />
      );
    }

    return <ResponsiveSlider>{books.map(renderBook)}</ResponsiveSlider>;
  };

  return (
    <section className={styles.container}>
      <h3 className={styles.title}>Books to Friends</h3>
      {renderContent()}
    </section>
  );
};

export default BooksToFriendsSection;
