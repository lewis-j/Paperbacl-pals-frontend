import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { Form, Input } from "reactstrap";
import styles from "./SearchForm.module.scss";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { debounce } from "../../../../utilities/debounce";

const SearchForm = ({
  onSubmitForm,
  customStyles,
  mobileView,
  placeholder,
  isLoading,
  setSearchInput,
  searchInput,
}) => {
  const debouncedSearch = React.useCallback(
    debounce((value) => {
      onSubmitForm(value);
    }, 300),
    [onSubmitForm]
  );

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    debouncedSearch(value);
  };

  return (
    <Form className={`d-flex bg-white ${customStyles || styles.rounded}`}>
      <Input
        name="search"
        autoComplete="off"
        autoFocus={mobileView}
        placeholder={placeholder}
        type="search"
        className={`${customStyles || styles.rounded} ${styles.input}`}
        value={searchInput}
        onChange={handleInputChange}
      />
      <button
        className={`${styles.magnigyingGlassBtn} ${styles.rounded}`}
        disabled={isLoading}
      >
        <FontAwesomeIcon icon={faMagnifyingGlass} size="lg" />
      </button>
    </Form>
  );
};

export default SearchForm;
