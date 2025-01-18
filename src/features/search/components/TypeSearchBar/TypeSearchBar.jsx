import React, { useState, useRef, useEffect } from "react";
import { Input, Form } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  searchBooks,
  searchUsers,
  setQuery,
  condition,
} from "../../searchResultsSlice";

import styles from "./TypeSearchBar.module.scss"; // You'll need to create this

const TypeSearchBar = ({ searchType, customStyles, onClose, mobileView }) => {
  const [searchInput, setSearchInput] = useState("");
  const searchBarRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const status = useSelector((state) => state.searchResults.status);
  const isLoading = status === condition.LOADING;

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

  const onSubmitForm = async (e) => {
    e.preventDefault();
    if (!searchInput) return;
    dispatch(setQuery(searchInput));
    try {
      if (searchType === "books") {
        await dispatch(searchBooks({ query: searchInput })).unwrap();
      } else if (searchType === "users") {
        await dispatch(searchUsers({ query: searchInput })).unwrap();
      }
      setSearchInput("");
      navigate("/app/results", { state: { searchType } });
      if (onClose) onClose();
    } catch (error) {
      console.error("Error in TypeSearchBar", { error });
    }
  };

  return (
    <div className={styles.searchBar} ref={searchBarRef}>
      <Form
        onSubmit={onSubmitForm}
        className={`d-flex bg-white ${customStyles || styles.rounded}`}
      >
        <Input
          name="search"
          autoComplete="off"
          autoFocus={mobileView}
          placeholder={`Search ${searchType === "books" ? "Books" : "Users"}`}
          type="search"
          className={`${customStyles || styles.rounded} ${styles.input}`}
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button
          className={`${styles.magnigyingGlassBtn} ${styles.rounded}`}
          disabled={isLoading}
        >
          <FontAwesomeIcon icon={faMagnifyingGlass} size="lg" />
        </button>
      </Form>
    </div>
  );
};

export default TypeSearchBar;
