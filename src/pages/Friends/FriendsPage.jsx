import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import {
  ContactList,
  FriendsNavigation,
  getFriendsUserData,
  RequestList,
} from "../../features/Friends";
import styles from "./FriendsPage.module.scss";
import { useBSSizeFromWidth } from "../../utilities/getBSSizeFromWidth";
import { NoContent } from "../../components";
import { faUserGroup } from "@fortawesome/free-solid-svg-icons";
import { useFriendRequestModal } from "../../features/Friends/hooks/useFriendRequestModal";

const FriendsPage = () => {
  const [activeId, setActiveId] = useState("");
  const [activeTab, setActiveTab] = useState("friends");
  const { currentFriend } = useSelector((state) => state.friends);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);
  const windowSize = useBSSizeFromWidth();
  const isLrgScreen = windowSize === "lg";
  const { renderModal, friendModalActions } = useFriendRequestModal();

  const handleAcceptRequest = async (user, request_id) => {
    friendModalActions.acceptFriendRequest({ ...user, request_id });
  };

  const enterUser = async (_id) => {
    try {
      setActiveId(_id);
      if (!isLrgScreen) setIsOpen(false);
      await dispatch(getFriendsUserData({ user_id: _id })).unwrap();
      navigate(`library`);
    } catch (error) {
      console.error("Error fetching friend data:", error);
      // Optionally add error handling UI feedback here
    }
  };

  const switchToListView = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={styles.container}>
      {renderModal()}
      <div
        className={styles.contactList}
        style={isLrgScreen ? {} : { width: "100%" }}
      >
        <div className={styles.tabs}>
          <button
            className={activeTab === "friends" ? styles.activeTab : ""}
            onClick={() => setActiveTab("friends")}
          >
            Friends
          </button>
          <button
            className={activeTab === "requests" ? styles.activeTab : ""}
            onClick={() => setActiveTab("requests")}
          >
            Requests
          </button>
        </div>

        {activeTab === "friends" ? (
          <ContactList activeId={activeId} setUser={enterUser} />
        ) : (
          <RequestList acceptRequest={handleAcceptRequest} />
        )}
      </div>
      <div
        style={
          isLrgScreen
            ? {}
            : isOpen
            ? { width: "100%", transform: "translateX(100%)" }
            : { width: "100%" }
        }
        className={
          isOpen ? styles.mainView : `${styles.viewOpen} ${styles.mainView}`
        }
      >
        <FriendsNavigation isOpen={isOpen} toggleList={switchToListView} />
        <div className={styles.innerView}>
          {currentFriend ? (
            <Outlet />
          ) : (
            <NoContent
              icon={faUserGroup}
              text="Select a friend to view their library"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default FriendsPage;
