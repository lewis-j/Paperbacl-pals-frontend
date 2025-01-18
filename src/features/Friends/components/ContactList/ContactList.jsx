import styles from "./ContactList.module.scss";
import { UserCard } from "../UserCard";
import { useSelector } from "react-redux";
import { useFriendRequestModal } from "../../hooks/useFriendRequestModal";
import { useState } from "react";
import { NoContent } from "../../../../components";
import { faUserAltSlash } from "@fortawesome/free-solid-svg-icons";

const ContactList = ({ activeId = null, setUser }) => {
  const { friendsList } = useSelector((state) => state.friends);
  const { renderModal, friendModalActions } = useFriendRequestModal();
  const [menuId, setMenuId] = useState(-1);

  if (!friendsList || friendsList.length === 0)
    return <NoContent icon={faUserAltSlash} text="No friends yet" />;

  const renderFriends = (friendsList) => {
    return friendsList.map(({ _id, username, profilePic }) => {
      const menuItems = [
        {
          label: "Remove Friend",
          onClick: () =>
            friendModalActions.removeFriend({ _id, username, profilePic }),
        },
        { label: "Block", onClick: () => alert("clicked") },
      ];

      return (
        <div
          key={`FriendsList:${_id}`}
          onClick={() => setUser(_id)}
          className={
            activeId === _id
              ? [styles.user_item, styles.isActive].join(" ")
              : styles.user_item
          }
        >
          <UserCard
            username={username}
            profilePic={profilePic}
            isActive={activeId === _id}
            isMenuOpen={menuId === _id}
            _id={_id}
            menuItems={menuItems}
            setMenuId={setMenuId}
          />
        </div>
      );
    });
  };

  return (
    <>
      <div className={styles.container}>{renderFriends(friendsList)}</div>
      {renderModal()}
    </>
  );
};

export default ContactList;
