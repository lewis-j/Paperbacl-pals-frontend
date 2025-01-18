import styles from "./SettingsPage.module.scss";
import { Settings } from "../../features/Authentication";

const SettingsPage = () => {
  return (
    <div className={styles.settingsContainer}>
      <div className={styles.heading}>
        <h1>Settings</h1>
      </div>
      <Settings />
    </div>
  );
};

export default SettingsPage;
