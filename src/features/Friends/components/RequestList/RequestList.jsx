import styles from "./RequestList.module.scss";
import { UserCard } from "../UserCard";
import { useSelector } from "react-redux";
import { NoContent } from "../../../../components";
import { faUserSlash } from "@fortawesome/free-solid-svg-icons";

const RequestList = ({ acceptRequest }) => {
  const { friendRequestInbox } = useSelector((state) => state.friends);

  if (!friendRequestInbox || friendRequestInbox.length === 0)
    return <NoContent icon={faUserSlash} text="No pending requests" />;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Friend Requests</h2>
      {friendRequestInbox.map(({ _id, sender }) => (
        <div key={`FriendRequest:${_id}`} className={styles.user_item}>
          <UserCard
            username={sender.username}
            profilePic={sender.profilePic}
            _id={sender._id}
          />
          <button onClick={() => acceptRequest(sender, _id)}>Accept</button>
        </div>
      ))}
    </div>
  );
};

export default RequestList;
