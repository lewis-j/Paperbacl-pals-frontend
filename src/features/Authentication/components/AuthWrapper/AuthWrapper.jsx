import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import * as asyncStatus from "../../../../data/asyncStatus";
import { fetchUser } from "../../authUserSlice";
import { fetchNotifications } from "../../../Notifications";
import { PageLoading } from "../../../../components";

export function AuthWrapper({ children }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userStatus = useSelector((state) => state.authUser.status);
  const currentUser = useSelector((state) => state.authUser.currentUser);

  const isLoading = userStatus === asyncStatus.LOADING;
  const isSucceeded = userStatus === asyncStatus.SUCCEEDED;
  const isIdle = userStatus === asyncStatus.IDLE;

  useEffect(() => {
    if (isIdle && !currentUser) {
      dispatch(fetchUser())
        .unwrap()
        .catch((error) => {
          if (error.status === 401) {
            navigate("/");
          }
          console.error("Failed to fetch user:", error);
        });
    }
  }, [dispatch, isIdle, navigate, currentUser]);

  useEffect(() => {
    if (currentUser && isSucceeded) {
      dispatch(fetchNotifications());
    }
  }, [dispatch, currentUser, isSucceeded]);

  if (isLoading) {
    return <PageLoading />;
  }

  return children;
}
