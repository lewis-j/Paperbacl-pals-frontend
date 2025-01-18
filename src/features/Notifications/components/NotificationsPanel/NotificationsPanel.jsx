import { useSelector, useDispatch } from "react-redux";
import { NoContent } from "../../../../components";
import { faBell, faEllipsisV, faX } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef, useState } from "react";
import styles from "./NotificationsPanel.module.scss";
import { NotificationsCard } from "../NotificationsCard";
import * as asyncStatus from "../../../../data/asyncStatus";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useNotificationModal from "../NotificationModal/NotificationModal";
import { markAsRead, markAllAsRead } from "../../notificationsSlice";

const NotificationsPanel = ({ onClose }) => {
  const { list: notifications, status } = useSelector(
    (state) => state.notifications
  );
  const { openNotificationModal, renderModal } =
    useNotificationModal(notifications);
  const [showReadNotifications, setShowReadNotifications] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const processNotifications = (notifications) => {
    return notifications.reduce(
      (obj, cur) => ({
        ...obj,
        [cur.isRead ? "read" : "unread"]: [
          ...obj[cur.isRead ? "read" : "unread"],
          cur,
        ],
      }),
      { unread: [], read: [] }
    );
  };

  const _notifications = processNotifications(notifications);

  const renderUnreadNotifications = (notification, i) => {
    const { requestRef, requestType, _id, __v, ...remaining } = notification;
    const notificationProps = { ...remaining, _id };

    const getAcceptAndDeclineHandlers = () => {
      const acceptHandler = !notification?.confirmation
        ? null
        : async () => {
            openNotificationModal(_id);
          };
      const declineHandler = () => {
        dispatch(markAsRead(_id));
      };
      return {
        accept: acceptHandler,
        decline: declineHandler,
      };
    };

    return (
      <NotificationsCard
        key={`${_id}-${i}`}
        {...notificationProps}
        clickHandlers={getAcceptAndDeclineHandlers()}
        isLoading={status === asyncStatus.LOADING}
      />
    );
  };

  const renderReadNotifications = (notification, i) => {
    const { requestRef, requestType, _id, __v, ...remaining } = notification;
    const notificationProps = { ...remaining, _id };

    return (
      <NotificationsCard
        key={`${_id}`}
        {...notificationProps}
        isLoading={status === asyncStatus.LOADING}
      />
    );
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleMarkAllAsRead = () => {
    dispatch(markAllAsRead());
    setMenuOpen(false);
  };

  const renderNotifications = () => {
    if (notifications.length === 0)
      return (
        <NoContent
          icon={faBell}
          text="You currently don't have notifications"
        />
      );
    if (!showReadNotifications) {
      if (_notifications.unread.length === 0) {
        return (
          <NoContent
            icon={faBell}
            text="You currently don't have unread notifications"
          />
        );
      }
      return _notifications.unread.map(renderUnreadNotifications);
    }
    return _notifications.read.map(renderReadNotifications);
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.headerContainer}>
          <h3 className={styles.header}>Notifications</h3>
          <div className={styles.menuContainer}>
            <button className={styles.menuButton} onClick={toggleMenu}>
              <FontAwesomeIcon icon={faEllipsisV} />
            </button>
            <button className={styles.menuButton} onClick={() => onClose()}>
              <FontAwesomeIcon icon={faX} />
            </button>
          </div>

          {menuOpen && (
            <div className={styles.menuDropdown} ref={dropdownRef}>
              <button onClick={handleMarkAllAsRead}>Mark All as Read</button>
              <button
                onClick={() => setShowReadNotifications(!showReadNotifications)}
              >
                {showReadNotifications ? "Hide" : "Show"} Read Notifications
              </button>
            </div>
          )}
        </div>
        <div className={styles.notifications}>{renderNotifications()}</div>
      </div>
      {renderModal()}
    </>
  );
};

export default NotificationsPanel;
