import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchChatRooms } from "../../chatSlice";
import styles from "./ChatRoomsList.module.scss";
import { Avatar } from "../../../../components";
import { formatTimestamp } from "../../../../utilities/timeUtil";

const ChatRoomsList = ({ setUser }) => {
  const dispatch = useDispatch();
  const { chatRooms, loading, error } = useSelector((state) => state.chat);
  const currentUser = useSelector((state) => state.authUser.currentUser);

  useEffect(() => {
    dispatch(fetchChatRooms());
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className={styles.roomsList}>
      {chatRooms.map((room) => {
        const participant = room.participants.find(
          (p) => p._id !== currentUser._id
        );
        return (
          <div
            key={room._id}
            className={styles.roomItem}
            onClick={() => setUser(participant._id)}
          >
            <div className={styles.avatarWrapper}>
              <Avatar
                imgSrc={participant.profilePic}
                username={participant.username}
              />
            </div>
            <div className={styles.chatInfo}>
              <div className={styles.chatHeader}>
                <span className={styles.username}>{participant.username}</span>
                <span className={styles.timestamp}>
                  {formatTimestamp(room.lastMessage?.timestamp)}
                </span>
              </div>
              <div className={styles.messagePreview}>
                {room.lastMessage?.content || "No messages yet"}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ChatRoomsList;
