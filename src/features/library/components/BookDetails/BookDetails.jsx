import React from "react";
import styles from "./BookDetails.module.scss"; // Create a new module if needed

const BookDetails = ({ book, onClose }) => {
  return (
    <>
      <div className={styles.header}>
        <img
          src={book.coverImg}
          alt={book.title}
          className={styles.coverImage}
        />
        <div className={styles.titleSection}>
          <h2 className={styles.title}>{book.title}</h2>
          <p className={styles.author}>{book.authors.join(", ")}</p>
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Description</h3>
        <p className={styles.description}>{book.description}</p>
      </div>
    </>
  );
};

export default BookDetails;
