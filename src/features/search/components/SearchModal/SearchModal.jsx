import React from "react";
import { Modal } from "../../../../components";
import TypeSearchBar from "../TypeSearchBar/TypeSearchBar";
import styles from "./SearchModal.module.scss";
import OCRButton from "../../../../components/OCRButton/OCRButton";
import { useDispatch } from "react-redux";
import { searchBooks, setQuery } from "../../searchResultsSlice";
import { useNavigate } from "react-router-dom";

const SearchModal = ({ isOpen, onClose, searchType }) => {
  const title =
    searchType === "books" ? "Add books to you library" : "Find Friends";
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const onTextExtracted = async (text) => {
    console.log("text extracted", text, typeof text);
    try {
      const result = await dispatch(searchBooks({ query: text })).unwrap();
      dispatch(setQuery(text));
      console.log("result", result);
      navigate("/app/results");
    } catch (error) {
      console.error("Error in onTextExtracted", { error });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      style={{ maxWidth: "550px" }}
    >
      <div className={styles.modalContent}>
        <p className={styles.subtitle}>
          {searchType === "books"
            ? "Search by title, author, or ISBN"
            : "Search by username or name"}
        </p>
        <div className={styles.searchBarContainer}>
          <TypeSearchBar
            searchType={searchType}
            onClose={onClose}
            customStyles={styles.searchBarCustom}
          />
        </div>

        {searchType === "books" && (
          <OCRButton onTextExtracted={onTextExtracted} />
        )}
      </div>
    </Modal>
  );
};

export default SearchModal;
