import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { navItems } from "../config/navConfig";
import styles from "./DesktopNavigation.module.scss";
import logo from "../../../../Assets/imgs/pppals_white.png";
import { SearchBar } from "../../../../features/search";
import useHandleAction from "../../hooks/useNavigationActions";
import { useLocation } from "react-router-dom";

const DesktopNavigation = ({ openProfileMenu }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const handleAction = useHandleAction(openProfileMenu);

  const renderNavLinksWithLabels = (navLinks) => {
    return navLinks.map((item) => (
      <button
        key={item.id}
        className={
          location.pathname === item.path
            ? styles.activeNavLink
            : styles.navLink
        }
        onClick={() => navigate(item.path)}
      >
        {item.label}
      </button>
    ));
  };

  const renderNavLinksAsIcons = (navItems) => {
    return navItems.map((item) => (
      <button
        key={item.id}
        className={styles.iconButton}
        onClick={() =>
          item.action ? handleAction(item.action) : navigate(item.path)
        }
        title={item.label}
      >
        <FontAwesomeIcon
          icon={item.icon}
          style={{ boxSizing: "border-box" }}
          className={styles.friendsIcon}
        />
      </button>
    ));
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContent}>
        {/* Logo */}
        <img
          src={logo}
          className={styles.logo}
          alt="Logo"
          onClick={() => navigate("/app")}
        />

        {/* Primary Navigation */}
        <div className={styles.primaryNav}>
          {renderNavLinksWithLabels(navItems.primary)}
        </div>

        {/* Search Bar */}
        <div className={styles.searchContainer}>
          <SearchBar expandSize="md" />
        </div>

        {/* Secondary Icons */}
        <div className={styles.secondaryNav}>
          {renderNavLinksAsIcons(navItems.secondary)}
        </div>
      </div>
    </nav>
  );
};

export default DesktopNavigation;
