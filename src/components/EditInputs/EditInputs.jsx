import styles from "./EditInputs.module.scss";
import { useState, useRef, useEffect } from "react";

const EditInput = ({
  isEdit,
  value,
  handleClick,
  set,
  multiline = false,
  dropdown = false,
  suggestions = [],
  isLoading = false,
  placeholder = "",
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!isEdit && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEdit]);

  return (
    <div className={styles.editInput}>
      {isEdit ? (
        <div
          className={`${styles.name} ${value ? "" : styles.placeholder}`}
          onClick={() => {
            handleClick();
            set(value);
          }}
        >
          {value || placeholder}
        </div>
      ) : (
        <div className={styles.inputContainer}>
          {dropdown ? (
            <>
              <input
                ref={inputRef}
                type="text"
                value={value}
                placeholder={placeholder}
                onChange={(e) => {
                  set(e.target.value);
                  setShowDropdown(true);
                }}
                className={
                  showDropdown && suggestions.length > 0
                    ? styles.withSuggestions
                    : ""
                }
              />
              {isLoading && <div className={styles.loader}>Loading...</div>}
              {showDropdown && suggestions.length > 0 && (
                <ul className={styles.dropdown}>
                  {suggestions.map((suggestion) => (
                    <li
                      key={suggestion.place_id}
                      onClick={() => {
                        set(suggestion.description);
                        setShowDropdown(false);
                      }}
                    >
                      {suggestion.description}
                    </li>
                  ))}
                </ul>
              )}
            </>
          ) : multiline ? (
            <textarea
              ref={inputRef}
              value={value}
              onChange={(e) => set(e.target.value)}
              placeholder={placeholder}
            />
          ) : (
            <input
              ref={inputRef}
              type="text"
              value={value}
              onChange={(e) => set(e.target.value)}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default EditInput;
