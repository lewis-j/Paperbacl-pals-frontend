/**
 * @fileoverview Dashboard page component that displays various book-related sections including
 * current reads, books shared with friends, and book requests.
 */

import styles from "./DashboardPage.module.scss";
import CurrentReadSection from "./components/CurrentReadSection";
import BooksFromFriendsSection from "./components/BooksFromFriendsSection";
import BooksToFriendsSection from "./components/BooksToFriendsSection";
import BookRequestsSection from "./components/BookRequestSection";
import { useBookSelectors } from "../../features/library/hooks/useBookSelectors";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useLibraryModalManager } from "../../features/library/hooks/useLibraryModalManager";
import { Col, Row } from "../../lib/BootStrap";

/**
 * Dashboard page component that organizes and displays the user's book activities.
 * This component serves as the main dashboard view, combining multiple sections for
 * book management and social interactions.
 *
 * @component
 * @returns {JSX.Element} A structured dashboard layout with multiple book-related sections
 */
export const DashboardPage = () => {
  /**
   * Destructured book data from Redux store
   * @type {{
   *   currentRead: Object,
   *   booksToFriends: Array,
   *   booksFromFriends: Array,
   *   ownedBookRequests: Array
   * }}
   */
  const { currentRead, booksToFriends, booksFromFriends, ownedBookRequests } =
    useBookSelectors(useSelector((state) => state.userBooks));

  /**
   * State to track which book card's menu is currently active
   * @type {[string, Function]} activeCardId and its setter
   */
  const [activeCardId, setActiveCardId] = useState("");

  /**
   * Custom hook that provides modal functionality and menu items for book actions
   * @type {{
   *   menuItems: {
   *     currentRead: Function,
   *     booksFromFriends: Array,
   *     booksToFriends: Array,
   *     bookRequests: Array
   *   },
   *   renderModal: Function
   * }}
   */
  const { menuItems, renderModal, modalActions } =
    useLibraryModalManager(setActiveCardId);

  const fromFriendsMenuItems = menuItems.booksFromFriends;
  const toFriendsMenuItems = menuItems.booksToFriends;
  const requestMenuItems = menuItems.bookRequests;

  return (
    <div className={`container ${styles.container}`}>
      {renderModal()}
      <Row className={styles.sectionsWrapper}>
        <Col sm={12} md={6}>
          <CurrentReadSection
            currentRead={currentRead}
            activeCard={activeCardId}
            setActiveCard={setActiveCardId}
            menuItems={menuItems.currentRead(currentRead)}
            bookCardClickHandler={() =>
              modalActions.viewUserBookDetails(currentRead)
            }
          />
        </Col>
        <Col sm={12} md={6}>
          <BooksFromFriendsSection
            books={booksFromFriends}
            activeCard={activeCardId}
            setActiveCard={setActiveCardId}
            menuItems={fromFriendsMenuItems}
            bookCardClickHandler={(userBook) =>
              modalActions.viewUserBookDetails(userBook)
            }
          />
        </Col>
        <Col sm={12} md={6}>
          <BooksToFriendsSection
            books={booksToFriends}
            activeCard={activeCardId}
            setActiveCard={setActiveCardId}
            menuItems={toFriendsMenuItems}
            bookCardClickHandler={(userBook) =>
              modalActions.viewUserBookDetails(userBook)
            }
          />
        </Col>
        <Col sm={12} md={6}>
          <BookRequestsSection
            requests={ownedBookRequests}
            activeCard={activeCardId}
            setActiveCard={setActiveCardId}
            menuItems={requestMenuItems}
            bookCardClickHandler={(userBook) =>
              modalActions.viewUserBookDetails(userBook)
            }
          />
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;
