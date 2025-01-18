import React from "react";
import { useSelector } from "react-redux";
import * as condition from "../../../data/asyncStatus";
import { NoContent, PageLoading } from "../../../components";
import {
  faBookOpenReader,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./StatusHandler.module.scss";
const StatusHandler = ({ children, results }) => {
  const { status, error } = useSelector((state) => state.searchResults);

  const isLoading = status === condition.LOADING;
  const isError = status === condition.FAILED;

  if (isLoading) {
    return <PageLoading />;
  }

  if (isError) {
    console.error(error);
    return (
      <div className={styles.noContentContainer}>
        <NoContent icon={faTriangleExclamation}>
          Looks like something went wrong
        </NoContent>
      </div>
    );
  }

  if (!results.length) {
    return (
      <div className={styles.noContentContainer}>
        <NoContent icon={faBookOpenReader}>
          No results yet search again!
        </NoContent>
      </div>
    );
  }
  return children;
};

export default StatusHandler;
