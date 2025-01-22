import styles from "./StarRating.module.scss";
import React from "react";

const StarRating = ({ value = 3, onChange, interactive = false }) => {
  const ratingId = React.useId(); // Generate unique ID for this instance

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
            name={`rate-${ratingId}`} // Make name unique per instance
            id={`star${index + 1}-${ratingId}`} // Make id unique per instance
            type="radio"
            checked={value === index + 1}
            onChange={handleChange}
            disabled={!interactive}
          />
          <label
            title={`${index + 1} stars`}
            htmlFor={`star${index + 1}-${ratingId}`}
            style={{
              cursor: interactive ? "pointer" : "default",
              pointerEvents: interactive ? "auto" : "none",
            }}
          />
        </React.Fragment>
      )).reverse()}
    </div>
  );
};

export default StarRating;
