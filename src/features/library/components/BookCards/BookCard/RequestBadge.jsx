import { faUserFriends } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./RequestBadge.module.scss";
import React from "react";

const RequestBadge = ({ count, children, clickHandler }) => {
  if (count === 0) return children;
  return (
    <div className={styles.wrapper}>
      <div className={styles.badge} onClick={clickHandler}>
        <FontAwesomeIcon icon={faUserFriends} className={styles.icon} />
        <span className={styles.count}>{count} </span>
        <div className={styles.text}>
          {count === 1 ? "request" : "requests"}
        </div>
      </div>
      {children}
    </div>
  );
};

export default RequestBadge;
