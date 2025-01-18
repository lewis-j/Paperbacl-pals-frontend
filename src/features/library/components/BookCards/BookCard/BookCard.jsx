import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faX } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import styles from "./BookCard.module.scss";
import { Button } from "../../../../../components";

const BookCard = ({
  _id,
  book,
  menuItems = [],
  isActive = false,
  setActive,
  badge = null,
}) => {
  const { coverImg, title } = book;

  const cardFilter = isActive
    ? {
        className: styles.isOpen,
        icon: faX,
        size: "xs",
        menuBtnClick: () => {
          setActive("");
        },
      }
    : {
        className: styles.menuBtn,
        icon: faBars,
        size: "sm",
        menuBtnClick: () => {
          setActive(_id);
        },
      };

  return (
    <div className={styles.container}>
      <div className={`${styles.book} ${isActive ? styles.isActive : ""}`}>
        {badge && !isActive && (
          <div className={styles.badgeWrapper}>{badge}</div>
        )}
        <img className={styles.img} src={coverImg} alt={title} />
        <div className={cardFilter.className} onClick={cardFilter.menuBtnClick}>
          <FontAwesomeIcon icon={cardFilter.icon} size={cardFilter.size} />
        </div>
        {isActive && menuItems.length !== 0 && (
          <div className={styles.menu}>
            {menuItems.map(({ text, clickHandler }, i) => (
              <Button
                key={`menu-list${i}`}
                onClick={() => clickHandler("test")}
                variant="menu-white-outline"
              >
                {text}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookCard;
