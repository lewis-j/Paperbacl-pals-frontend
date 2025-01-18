import { useDispatch } from "react-redux";
import { setNotificationsIsOpen } from "../../../features/Notifications/notificationsSlice";
import { setChatOpen } from "../../../features/Chat/chatSlice";
import { logout } from "../../../features/Authentication";

const useHandleAction = (openProfileMenu = null) => {
  const dispatch = useDispatch();
  const handleAction = (action) => {
    switch (action) {
      case "toggleNotifications":
        console.log("toggle notifications");
        dispatch(setNotificationsIsOpen(true));
        break;
      case "toggleChat":
        console.log("toggle chat should open");
        dispatch(setChatOpen(true));
        break;
      case "openProfileMenu":
        openProfileMenu();
        break;
      case "logout":
        dispatch(logout());
        break;
      default:
        break;
    }
  };
  return handleAction;
};

export default useHandleAction;
