import React, { useState, useRef, useEffect } from "react";
import { Input, Form } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  searchBooks,
  setQuery,
  searchUsers,
  condition,
} from "../../searchResultsSlice";

import styles from "./SearchBar.module.scss";

const DropDownSearch = ({ searchInput, bookSearch, userSearch }) => {
  const handleBookSearch = () => {
    bookSearch(searchInput);
  };

  const handleUserSearch = () => {
    userSearch(searchInput);
  };
  return (
    <div className={styles.dropdown__container}>
      <div className={styles.dropdown__menu}>
        <div className={styles.dropdown__item} onClick={handleBookSearch}>
          "{searchInput}"{" "}
          <span className={styles.dropdown_input__grey}>in Books</span>
        </div>
        <div className={styles.dropdown__item} onClick={handleUserSearch}>
          "{searchInput}"{" "}
          <span className={styles.dropdown_input__grey}>in Users</span>
        </div>
      </div>
    </div>
  );
};

const SearchBar = ({ customStyles, onClose, mobileView }) => {
  const [searchInput, setSearchInput] = useState("");
  const searchBarRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const status = useSelector((state) => state.searchResults.status);
  const isLoading = status === condition.LOADING;
  const isMenuOpen = searchInput !== "";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchBarRef.current &&
        !searchBarRef.current.contains(event.target)
      ) {
        setSearchInput("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const dispatchBookSearch = async (query) => {
    dispatch(setQuery(query));
    await dispatch(searchBooks({ query: query })).unwrap();
    setSearchInput("");
    navigate("/app/results", { state: { searchType: "books" } });
  };

  const dispatchUserSearch = async (query) => {
    dispatch(setQuery(query));
    try {
      await dispatch(searchUsers({ query: query })).unwrap();
      setSearchInput("");
      navigate("/app/results", { state: { searchType: "users" } });
    } catch (error) {
      console.error("Error in SearchBar", { ...error });
    }
  };

  const onSubmitForm = async (e) => {
    e.preventDefault();
    if (!searchInput) return;
    dispatch(setQuery(searchInput));
    try {
      await dispatch(searchBooks({ query: searchInput })).unwrap();
      await dispatch(searchUsers({ query: searchInput })).unwrap();
      setSearchInput("");
      navigate("/app/results", { state: { searchType: "all" } });
      if (onClose) onClose();
    } catch (error) {
      console.error("Error in SearchBar", { error });
    }
  };

  return (
    <div className={styles.searchBar} ref={searchBarRef}>
      <Form
        onSubmit={onSubmitForm}
        className={`d-flex bg-white ${customStyles || styles.rounded} ${
          isMenuOpen ? styles.bottomFlat : ""
        }`}
      >
        <Input
          name="search"
          autoComplete="off"
          autoFocus={mobileView}
          placeholder="Search Books or Users"
          type="search"
          className={`${customStyles || styles.rounded} ${styles.input}`}
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value);
          }}
        />
        <button
          className={`${styles.magnigyingGlassBtn} ${styles.rounded}`}
          disabled={isLoading}
        >
          <FontAwesomeIcon icon={faMagnifyingGlass} size="lg" />
        </button>
      </Form>
      {isMenuOpen && (
        <DropDownSearch
          searchInput={searchInput}
          bookSearch={dispatchBookSearch}
          userSearch={dispatchUserSearch}
        />
      )}
    </div>
  );
};

export default SearchBar;
