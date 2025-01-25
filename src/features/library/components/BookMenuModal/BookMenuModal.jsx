import { Button, Modal } from "../../../../components";
import BookModalHeader from "../ModalForms/Shared/BookModalHeader/BookModalHeader";
import styles from "./BookMenuModal.module.scss";

const BookMenuModal = ({
  isActive,
  setActive,
  menuItems,
  bookData,
  userCard_id,
}) => {
  const close = () => setActive("");

  return (
    <Modal isOpen={isActive} onClose={close}>
      <div className={styles.menu}>
        <BookModalHeader
          book={bookData?.book}
          currentPage={bookData?.currentPage}
          owner={bookData?.owner}
          sender={bookData?.sender}
          dueDate={bookData?.dueDate}
        />
        {menuItems.map(({ text, clickHandler }, i) => (
          <Button
            key={`menu-item-${i}`}
            onClick={() => {
              clickHandler(userCard_id);
              close();
            }}
            variant="primary"
            role="menuitem"
          >
            {text}
          </Button>
        ))}
      </div>
    </Modal>
  );
};

export default BookMenuModal;
