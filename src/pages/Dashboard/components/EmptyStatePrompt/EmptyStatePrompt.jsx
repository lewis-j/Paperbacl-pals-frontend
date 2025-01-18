import { useNavigate } from "react-router-dom";
import { NoContent, Button } from "../../../../components";
import styles from "./EmptyStatePrompt.module.scss";
import { faBook } from "@fortawesome/free-solid-svg-icons";

const EmptyStatePrompt = ({ title, text, route }) => {
  const navigate = useNavigate();
  return (
    <div className={styles.noContent}>
      <NoContent icon={faBook} text={text}>
        <Button
          variant="primary"
          onClick={() => {
            if (route) navigate(route);
          }}
        >
          {title}
        </Button>
      </NoContent>
    </div>
  );
};

export default EmptyStatePrompt;
