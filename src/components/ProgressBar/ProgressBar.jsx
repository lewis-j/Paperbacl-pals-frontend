import styles from "./ProgressBar.module.scss";

const ProgressBar = ({ value = 0 }) => {
  return (
    <div className={styles.container}>
      <div
        className={styles.highlightedBar}
        style={{ width: `${value}%` }}
      ></div>
    </div>
  );
};
export default ProgressBar;
