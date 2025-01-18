import { faCheck, faX, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { Button } from "../Button";
import styles from "./EditButtons.module.scss";

const EditButtons = ({ onSubmit, onClose, isLoading }) => {
  return (
    <div className={styles.editBtns}>
      <Button
        icon={isLoading ? faSpinner : faX}
        variant="secondary"
        iconStyle={`${styles.closeBtn} ${isLoading ? styles.spin : ""}`}
        onClick={() => {
          onClose();
        }}
        disabled={isLoading}
      >
        Cancel
      </Button>
      <Button
        icon={isLoading ? faSpinner : faCheck}
        variant="primary"
        iconStyle={`${styles.acceptBtn} ${isLoading ? styles.spin : ""}`}
        onClick={() => {
          console.log("handle submit");
          onSubmit();
        }}
        disabled={isLoading}
      >
        Accept
      </Button>
    </div>
  );
};

export default EditButtons;
