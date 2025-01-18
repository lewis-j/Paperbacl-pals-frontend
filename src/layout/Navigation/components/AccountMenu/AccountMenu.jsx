import React from "react";
import { navItems } from "../config/navConfig";
import styles from "./AccountMenu.module.scss";
import { useNavigate } from "react-router-dom";
import { Avatar } from "../../../../components";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import useHandleAction from "../../hooks/useNavigationActions";

const AccountMenu = ({ onClose }) => {
  const navigate = useNavigate();
  const handleAction = useHandleAction();
  const { profilePic, username } = useSelector(
    (state) => state.authUser.currentUser
  );
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Avatar imgSrc={profilePic} username={username} /> {username}
        <button
          className={styles.closeButton}
          onClick={() => {
            onClose();
          }}
        >
          <FontAwesomeIcon icon={faX} />
        </button>
      </div>
      <div className={styles.links}>
        {navItems.accountMenu.map((item) => (
          <button
            key={item.id}
            className={styles.navLink}
            onClick={() => {
              if (item.action) {
                handleAction(item.action);
              } else {
                navigate(item.path);
              }
              onClose();
            }}
          >
            <FontAwesomeIcon
              icon={item.icon}
              style={{ boxSizing: "border-box" }}
              className={styles.icon}
            />
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AccountMenu;
