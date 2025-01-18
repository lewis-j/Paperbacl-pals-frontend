import { useState } from "react";
import { SearchForm } from "../../../search/components";
import { BookContainer } from "../BookContainer";
import styles from "./LibrarySection.module.scss";

const LibrarySection = ({
  title,
  books,
  filteredBooks,
  renderBook,
  searchPlaceholder,
  noContent,
  onSearch,
}) => {
  const [searchInput, setSearchInput] = useState("");

  return (
    <>
      <div className={styles.header}>
        <h4 className={styles.subtitle}>{title}</h4>
        <SearchForm
          customStyles={styles.searchForm}
          onSubmitForm={onSearch}
          placeholder={searchPlaceholder}
          isLoading={false}
          setSearchInput={setSearchInput}
          searchInput={searchInput}
        />
      </div>

      <BookContainer noContent={noContent}>
        {(filteredBooks || books).map(renderBook)}
      </BookContainer>
    </>
  );
};

export default LibrarySection;
