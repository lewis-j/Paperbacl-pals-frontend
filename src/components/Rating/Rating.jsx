import styles from "./Rating.module.scss";
import React from "react";

const Rating = ({ value = 3, onChange, interactive = false }) => {
  const handleChange = (e) => {
    if (interactive && onChange) {
      onChange(Number(e.target.value));
    }
  };

  return (
    <div className={styles.rating}>
      {Array.from({ length: 5 }, (_, index) => (
        <React.Fragment key={index + 1}>
          <input
            value={index + 1}
            name="rate"
            id={`star${index + 1}`}
            type="radio"
            defaultChecked={value === index + 1}
            onChange={handleChange}
            disabled={!interactive}
          />
          <label
            title={`${index + 1} stars`}
            htmlFor={`star${index + 1}`}
            style={{ cursor: interactive ? "pointer" : "default" }}
          />
        </React.Fragment>
      )).reverse()}
    </div>
  );
};

export default Rating;
