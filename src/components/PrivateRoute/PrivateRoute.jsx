import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import * as asyncStatus from "../../data/asyncStatus";
import { PageLoading } from "../PageLoading";

const PrivateRoute = ({ children }) => {
  const { currentUser, status } = useSelector((state) => state.authUser);
  const isLoading = status === asyncStatus.LOADING;
  const isIdle = status === asyncStatus.IDLE;
  const isSucceeded = status === asyncStatus.SUCCEEDED;

  if (isLoading || isIdle) {
    return <PageLoading />;
  }

  return currentUser && isSucceeded ? children : <Navigate to="/" />;
};

export default PrivateRoute;
