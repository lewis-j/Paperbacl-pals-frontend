import { Outlet } from "react-router-dom";
import DesktopNavigation from "../DesktopNavigation/DesktopNavigation";
import MobileNavigation from "../MobileNavigation/MobileNavigation";
import SlidePanel from "../../../../components/SlidePanel/SlidePanel";
import { setNotificationsIsOpen } from "../../../../features/Notifications/notificationsSlice";
import { NotificationsPanel } from "../../../../features/Notifications";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import ChatModal from "../../../../features/Chat/components/ChatModal/ChatModal";
import AccountMenu from "../AccountMenu/AccountMenu";
import styles from "./MainNav.module.scss";

const useWindowWidth = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowWidth;
};

const MainNav = () => {
  const windowWidth = useWindowWidth();
  const isMobile = windowWidth < 916;
  const isNotificationsOpen = useSelector(
    (state) => state.notifications.isOpen
  );
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const setNoificationOpenState = (isOpen) => {
    dispatch(setNotificationsIsOpen(isOpen));
  };
  return (
    <>
      {isMobile ? (
        <MobileNavigation openProfileMenu={() => setIsProfileMenuOpen(true)} />
      ) : (
        <DesktopNavigation openProfileMenu={() => setIsProfileMenuOpen(true)} />
      )}
      <div className={styles.content}>
        <Outlet />
      </div>
      <SlidePanel
        open={isNotificationsOpen}
        onClose={() => {
          console.log("setting false in slide panel");
          setNoificationOpenState(false);
        }}
      >
        <NotificationsPanel
          onClose={() => {
            console.log("setting false in panel");
            setNoificationOpenState(false);
          }}
        />
      </SlidePanel>
      <SlidePanel
        open={isProfileMenuOpen}
        onClose={() => {
          setIsProfileMenuOpen(false);
        }}
      >
        <AccountMenu onClose={() => setIsProfileMenuOpen(false)} />
      </SlidePanel>
      <ChatModal />
    </>
  );
};

export default MainNav;
