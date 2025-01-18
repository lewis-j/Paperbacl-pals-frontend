import { Loading } from "../Loading";
import styles from "./PageLoading.module.scss";

const PageLoading = () => {
  return (
    <div className={styles.container}>
      <Loading isLight />
    </div>
  );
};
export default PageLoading;
