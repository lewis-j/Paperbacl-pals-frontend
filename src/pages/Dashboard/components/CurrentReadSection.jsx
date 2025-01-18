import React from "react";
import styles from "../DashboardPage.module.scss";
import { NoContent } from "../../../components";
import { faBook } from "@fortawesome/free-solid-svg-icons";
import { UserBookCardLrg } from "../../../features/library";

const CurrentReadSection = ({
  currentRead,
  activeCard,
  setActiveCard,
  menuItems,
}) => {
  const EmptyStatePrompt = ({ title, text, route }) => {
    return (
      <div className={styles.noContent}>
        <NoContent icon={faBook} text={text}>
          {title}
        </NoContent>
      </div>
    );
  };
  const renderCurrentRead = () => {
    if (!currentRead) {
      return (
        <EmptyStatePrompt
          title="Select Current Read"
          route="friends"
          text="You don't have a current read selected"
        />
      );
    }

    const { _id, owner, book, dueDate, currentPage } = currentRead;

    return (
      <UserBookCardLrg
        _id={_id}
        book={book}
        user={owner}
        dueDate={dueDate}
        currentPage={currentPage}
        isActive={activeCard === _id}
        setActive={setActiveCard}
        menuItems={menuItems}
      />
    );
  };

  return (
    <section className={styles.container}>
      <h3 className={styles.title}>Current Read</h3>
      {renderCurrentRead()}
    </section>
  );
};

export default CurrentReadSection;
