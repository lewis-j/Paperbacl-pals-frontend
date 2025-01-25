import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faX } from "@fortawesome/free-solid-svg-icons";
import styles from "./BookCard.module.scss";
import { BookMenuModal } from "../../BookMenuModal";

const BookCard = ({
  _id,
  book,
  menuItems = [],
  isActive = false,
  setActive,
  badge = null,
  bookCardClickHandler,
}) => {
  console.log("book", book);
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
      <div
        className={`${styles.book} ${isActive ? styles.isActive : ""}`}
        onClick={() => {
          if (!isActive) bookCardClickHandler();
        }}
      >
        {badge && !isActive && (
          <div className={styles.badgeWrapper}>{badge}</div>
        )}
        <img className={styles.img} src={coverImg} alt={title} />
        <div
          className={cardFilter.className}
          onClick={(e) => {
            e.stopPropagation();
            cardFilter.menuBtnClick();
          }}
        >
          <FontAwesomeIcon icon={cardFilter.icon} size={cardFilter.size} />
        </div>
        {isActive && menuItems.length !== 0 && (
          <div className={styles.menu}>
            <BookMenuModal
              isActive={isActive}
              setActive={setActive}
              menuItems={menuItems}
              bookData={{ book }}
              userCard_id={_id}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default BookCard;
