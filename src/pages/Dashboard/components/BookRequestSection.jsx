import React from "react";
import { ResponsiveSlider } from "../../../components";
import { BookCard, RequestBadge } from "../../../features/library";
import styles from "../DashboardPage.module.scss";
import EmptyStatePrompt from "./EmptyStatePrompt/EmptyStatePrompt";
import requestStatus from "../../../data/requestStatus";

const BookRequestsSection = ({
  requests,
  activeCard,
  setActiveCard,
  menuItems,
}) => {
  const renderBookRequest = (userBook) => {
    const {
      _id,
      book: { coverImg, title },
    } = userBook;

    const requestCount = userBook.requests.filter(
      (request) => request.status !== requestStatus.RETURNED
    ).length;

    const userBookSnapshot = { ...userBook };

    const bookRequestMenuItems = menuItems(userBookSnapshot);

    const viewRequests = bookRequestMenuItems[0].clickHandler;

    return (
      <RequestBadge
        key={_id}
        count={requestCount}
        clickHandler={() => {
          viewRequests();
        }}
      >
        <BookCard
          _id={_id}
          book={{ coverImg, title }}
          setActive={setActiveCard}
          isActive={activeCard === _id}
          menuItems={bookRequestMenuItems}
        />
      </RequestBadge>
    );
  };

  const renderContent = () => {
    if (requests.length === 0) {
      return (
        <EmptyStatePrompt
          title="Add More Books"
          route="library"
          text="No one has requested your books"
        />
      );
    }

    return (
      <ResponsiveSlider>{requests.map(renderBookRequest)}</ResponsiveSlider>
    );
  };

  return (
    <section className={styles.container}>
      <h3 className={styles.title}>Requests from Friends</h3>
      {renderContent()}
    </section>
  );
};

export default BookRequestsSection;
