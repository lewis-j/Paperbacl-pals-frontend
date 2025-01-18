import React from "react";
import styles from "./StatusModalContent.module.scss";

export const StatusModalContent = ({ imageUrl, label, timestamp, Icon }) => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        {Icon && (
          <div className={styles.iconWrapper}>
            <Icon size={24} />
          </div>
        )}
        <h4>{label} Photo</h4>
      </div>
      {timestamp && (
        <p className={styles.timestamp}>
          {new Date(timestamp).toLocaleDateString()}
        </p>
      )}
      <img src={imageUrl} alt={label} className={styles.image} />
    </div>
  );
};
