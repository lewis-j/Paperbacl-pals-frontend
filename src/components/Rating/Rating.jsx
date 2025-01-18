import styles from "./Rating.module.scss";
import React from "react";
const Rating = ({ value = 3 }) => {
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
            onChange={(e) => console.log("star clicked", e.target.value)}
          />
          <label title="text" htmlFor={`star${index + 1}`}></label>
        </React.Fragment>
      )).reverse()}
    </div>
  );
};

export default Rating;
