import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import styles from "./SearchCard.module.scss";
import { Badge } from "../../../../components";

const SearchCard = ({ cardData, onClick, isInLibrary }) => {
  const { title, author, thumbnail } = cardData;

  return (
    <div
      className={`${styles.wrapper} ${
        isInLibrary ? styles.inLibraryWrapper : ""
      }`}
      onClick={isInLibrary ? undefined : onClick}
    >
      <div className={styles.container}>
        <div className={styles.title}>
          <h6>{title}</h6>
          <small>{author}</small>
        </div>
        {thumbnail ? (
          <img className={styles.img} src={thumbnail} alt={title} />
        ) : (
          <FontAwesomeIcon icon={faImage} size="6x" />
        )}
        {isInLibrary && (
          <div className={styles.badgeWrapper}>
            <Badge.LibraryBadge />
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchCard;
