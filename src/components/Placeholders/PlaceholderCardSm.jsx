import React from "react";
import styles from "./Placeholder.module.scss";

const PlaceholderCardSm = () => {
  return (
    <div className="placeholder-glow" style={{ textAlign: "center" }}>
      <span className={`placeholder ${styles.placeholder}`}></span>
    </div>
  );
};

export default PlaceholderCardSm;
