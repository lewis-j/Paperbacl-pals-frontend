import styles from "./EmptyPage.module.scss";

const EmptyPage = ({ children }) => {
  return (
    <div className={styles.container}>
      <div className={styles.msg}>{children}</div>
    </div>
  );
};

export default EmptyPage;
