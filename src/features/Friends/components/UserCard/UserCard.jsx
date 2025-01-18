import React, { useEffect, useRef } from "react";
import { Avatar } from "../../../../components";
import styles from "./UserCard.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";

const UserCard = ({
  _id,
  isMenuOpen = false,
  username,
  profilePic,
  menuItems = [],
  setMenuId,
}) => {
  const dropdownRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMenuId(-1);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [setMenuId]);

  const renderMenuItems = () => {
    return menuItems.map((item) => (
      <div className={styles.menuItem} key={item.label}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            item.onClick();
          }}
        >
          {item.label}
        </button>
      </div>
    ));
  };
  return (
    <div className={styles.container}>
      <div className={styles.avatar}>
        <Avatar imgSrc={profilePic} username={username} />
      </div>
      <h4 className={styles.username}>{username}</h4>
      {menuItems.length > 0 && (
        <button
          className={styles.menuButton}
          onClick={(e) => {
            e.stopPropagation();
            console.log("setting menu id");
            setMenuId(_id);
          }}
        >
          <FontAwesomeIcon icon={faEllipsisV} />
        </button>
      )}
      {isMenuOpen && (
        <div
          className={`${styles.menuDropdown} ${isMenuOpen ? styles.open : ""}`}
          ref={dropdownRef}
        >
          {renderMenuItems()}
        </div>
      )}
    </div>
  );
};

export default UserCard;
