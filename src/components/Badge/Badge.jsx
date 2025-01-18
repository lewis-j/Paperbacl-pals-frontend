import {
  faBook,
  faCheck,
  faRotateLeft,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import styles from "./Badge.module.scss";

const BaseBadge = ({ text, icon, type }) => {
  return (
    <div className={`${styles["Badge"]} ${styles[`Badge-${type}`]}`}>
      {text} <FontAwesomeIcon icon={icon} />
    </div>
  );
};

const RequestBadge = () => (
  <BaseBadge text="Request sent" icon={faCheck} type="request" />
);
const LibraryBadge = () => (
  <BaseBadge text="In library" icon={faBook} type="library" />
);

const ReturnRequestedBadge = () => (
  <BaseBadge text="Return" icon={faRotateLeft} type="returnRequested" />
);

const Badge = {
  LibraryBadge,
  RequestBadge,
  ReturnRequestedBadge,
};

export default Badge;
