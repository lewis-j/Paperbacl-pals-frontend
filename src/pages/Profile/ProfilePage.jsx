import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBook,
  faStar,
  faUsers,
  faClockRotateLeft,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./ProfilePage.module.scss";
import { Avatar, Button } from "../../components";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  fetchReturnedBooks,
  getAllBookRequests,
} from "../../features/library/userBooksSlice";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const { currentUser } = useSelector((state) => state.authUser);
  const { friendsList } = useSelector((state) => state.friends);
  const { returnedBooks = null } = useSelector(
    (state) => state.userBooks.books
  );
  const { username, profilePic } = currentUser;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const BorrowedBookCount = returnedBooks?.borrowedBooks.length || 0;
  const LentBookCount = returnedBooks?.lentBooks.length || 0;

  useEffect(() => {
    Promise.all([
      dispatch(fetchReturnedBooks()).unwrap(),
      dispatch(getAllBookRequests()).unwrap(),
    ]).catch((error) => {
      console.error("One of the operations failed:", error);
    });
  }, [dispatch]);
  return (
    <div className={styles.container}>
      {/* User Header Section */}
      <div className={styles.userHeader}>
        <div className={styles.userInfo}>
          <Avatar imgSrc={profilePic} username={username} size="xl" />
          <h1>{username}</h1>
          <p className={styles.bio}>
            {currentUser.bio === ""
              ? "User bio goes here... "
              : currentUser.bio}
          </p>
        </div>
        <Button variant="secondary" onClick={() => navigate("/settings")}>
          Edit Profile
        </Button>
      </div>

      {/* Stats Section */}
      <div className={styles.statsSection}>
        <div
          className={`${styles.stat} ${styles.clickable}`}
          onClick={() => navigate("../borrowing-history")}
          role="button"
          tabIndex={0}
        >
          <FontAwesomeIcon icon={faBook} className={styles.statIcon} />
          <h3>Books Borrowed</h3>
          <span>{BorrowedBookCount}</span>
        </div>
        <div
          className={`${styles.clickable} ${styles.stat}`}
          onClick={() => navigate("../lending-history")}
          role="button"
          tabIndex={0}
        >
          <FontAwesomeIcon icon={faBook} className={styles.statIcon} />
          <h3>Books Lent</h3>

          <span>{LentBookCount}</span>
        </div>
        <div
          className={`${styles.clickable} ${styles.stat}`}
          onClick={() => navigate("../friends")}
          role="button"
          tabIndex={0}
        >
          <FontAwesomeIcon icon={faUsers} className={styles.statIcon} />
          <h3>Friends</h3>
          <span>{friendsList.length}</span>
        </div>
      </div>

      {/* Recent Activity */}
      <section
        className={styles.history}
        onClick={() => navigate("../transaction-history")}
      >
        <h2>
          <FontAwesomeIcon
            icon={faClockRotateLeft}
            className={styles.sectionIcon}
          />
          Transaction History
        </h2>
      </section>

      {/* Reviews Section */}
      <section className={styles.reviews}>
        <h2>
          <FontAwesomeIcon icon={faStar} className={styles.sectionIcon} />
          Recent Reviews
        </h2>
        {/* ReviewsList component */}
      </section>
    </div>
  );
};
export default ProfilePage;
