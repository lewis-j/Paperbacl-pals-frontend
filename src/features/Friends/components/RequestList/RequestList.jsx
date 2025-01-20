import styles from "./RequestList.module.scss";
import { UserCard } from "../UserCard";
import { useSelector } from "react-redux";
import { NoContent } from "../../../../components";
import { faUserSlash } from "@fortawesome/free-solid-svg-icons";

const RequestList = ({ acceptRequest }) => {
  const { friendRequestInbox, friendRequestOutbox } = useSelector(
    (state) => state.friends
  );

  // Combine and sort requests
  const allRequests = [
    ...(friendRequestInbox || []).map((req) => ({ ...req, type: "inbox" })),
    ...(friendRequestOutbox || []).map((req) => ({ ...req, type: "outbox" })),
  ]
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .filter((req) => req.status === "PENDING");

  if (allRequests.length === 0)
    return <NoContent icon={faUserSlash} text="No pending requests" />;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Friend Requests</h2>
      {allRequests.map((request) => {
        const user =
          request.type === "inbox" ? request.sender : request.recipient;
        return (
          <div
            key={`FriendRequest:${request._id}`}
            className={styles.user_item}
          >
            <UserCard
              username={user.username}
              profilePic={user.profilePic}
              _id={user._id}
            />
            {request.type === "inbox" ? (
              <button onClick={() => acceptRequest(user, request._id)}>
                Accept
              </button>
            ) : (
              <span className={styles.pending_label}>Pending</span>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default RequestList;
