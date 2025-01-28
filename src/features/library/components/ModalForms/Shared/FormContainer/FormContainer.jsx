import styles from "./FormContainer.module.scss";
import BookModalHeader from "../BookModalHeader/BookModalHeader";

const FormContainer = ({ children, bookData }) => {
  return (
    <div className={styles.container}>
      <BookModalHeader
        book={bookData.book}
        currentPage={bookData.currentPage}
        owner={bookData.owner}
        sender={bookData.sender}
        dueDate={bookData.dueDate}
      />
      <div className={styles.formContent}>{children}</div>
    </div>
  );
};

export default FormContainer;
