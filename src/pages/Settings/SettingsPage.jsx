import styles from "./SettingsPage.module.scss";
import { Settings } from "../../features/Authentication";

const SettingsPage = () => {
  return (
    <div className={styles.settingsContainer}>
      <h1>Settings</h1>
      <Settings />
    </div>
  );
};

export default SettingsPage;
