import ReactDOM from "react-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchEnterChatRoom,
  getParticipant,
  setChatOpen,
  setCurrentRoomId,
  setParticipantId,
} from "../../chatSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faTimes } from "@fortawesome/free-solid-svg-icons";
import Chat from "../Chat/Chat";
import styles from "./ChatModal.module.scss";
import { ContactList } from "../../../Friends";
import { UserCard } from "../../../Friends/components/UserCard";
import { useEffect, useState } from "react";
import ChatRoomsList from "../ChatRoomsList/ChatRoomsList";

const ChatModal = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.chat.isChatOpen);
  const participantId = useSelector((state) => state.chat.paticipantId);
  const friends = useSelector((state) => state.friends.friendsList);

  const selectedUser =
    useSelector(getParticipant(participantId)) ||
    friends.find((friend) => friend._id === participantId);

  const [activeTab, setActiveTab] = useState("contacts");

  useEffect(() => {
    if (participantId) {
      dispatch(fetchEnterChatRoom(participantId));
    }
  }, [participantId, selectedUser, dispatch]);

  const selectUserForChat = (userId) => {
    dispatch(setParticipantId(userId));
  };

  const handleBack = () => {
    dispatch(setCurrentRoomId(null));
    dispatch(setParticipantId(null));
  };
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          {participantId ? (
            <>
              <button
                className={styles.backButton}
                onClick={handleBack}
                aria-label="Back to contacts"
              >
                <FontAwesomeIcon icon={faArrowLeft} />
              </button>
              {selectedUser && (
                <UserCard
                  username={selectedUser.username}
                  profilePic={selectedUser.profilePic}
                />
              )}
            </>
          ) : (
            <div className={styles.tabs}>
              <button
                className={`${styles.tab} ${
                  activeTab === "contacts" ? styles.active : ""
                }`}
                onClick={() => setActiveTab("contacts")}
              >
                Contacts
              </button>
              <button
                className={`${styles.tab} ${
                  activeTab === "rooms" ? styles.active : ""
                }`}
                onClick={() => setActiveTab("rooms")}
              >
                Chat Rooms
              </button>
            </div>
          )}
          <button
            className={styles.closeButton}
            onClick={() => dispatch(setChatOpen(false))}
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        {participantId ? (
          <Chat participantId={participantId} />
        ) : (
          <div className={styles.tabContent}>
            {activeTab === "contacts" ? (
              <ContactList setUser={selectUserForChat} />
            ) : (
              <ChatRoomsList setUser={selectUserForChat} />
            )}
          </div>
        )}
      </div>
    </div>,
    document.getElementById("chat-root")
  );
};

export default ChatModal;
