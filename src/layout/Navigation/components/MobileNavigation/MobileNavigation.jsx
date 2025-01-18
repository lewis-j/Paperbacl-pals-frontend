import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import logo from "../../../../Assets/imgs/pppals_white.png";
import { navItems } from "../config/navConfig";
import styles from "./MobileNavigation.module.scss";
import classNames from "classnames";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import useHandleAction from "../../hooks/useNavigationActions";
import { SearchBar } from "../../../../features/search";

const MobileNavigation = ({ openProfileMenu }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchContainerRef = useRef(null);

  const handleActions = useHandleAction(openProfileMenu);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const [home, borrowed, library] = navItems.primary;

  // Combine and filter nav items
  const menuItems = [
    home,
    ...navItems.secondary.filter((item) => item.id !== "profile"),
    ...navItems.accountMenu,
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.topNavigation}>
          <button
            className={classNames(styles.hamburger, {
              [styles.active]: isMenuOpen,
            })}
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
          {!isSearchOpen ? (
            <img
              src={logo}
              className={styles.logo}
              alt="Logo"
              onClick={() => navigate("/app")}
              loading="eager"
              fetchPriority="high"
              width="150"
              height="40"
            />
          ) : (
            <div ref={searchContainerRef} className={styles.searchContainer}>
              <SearchBar />
            </div>
          )}
          {!isSearchOpen && (
            <button
              className={styles.searchButton}
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                color="white"
                size="lg"
              />
            </button>
          )}
        </div>
        <div className={styles.bottomNavigation}>
          <div className={styles.borrowedLink}>
            <Link to={borrowed.path}>
              <FontAwesomeIcon icon={borrowed.icon} />
              <span>{borrowed.label}</span>
            </Link>
          </div>
          <div className={styles.libraryLink}>
            <Link to={library.path}>
              <FontAwesomeIcon icon={library.icon} />
              <span>{library.label}</span>
            </Link>
          </div>
        </div>
      </div>

      <div className={classNames(styles.menu, { [styles.open]: isMenuOpen })}>
        <nav>
          <ul className={styles.navList}>
            {menuItems.map((item, i) => (
              <li key={`${item.id}-${i}`}>
                <div
                  className={styles.navItemContainer}
                  onClick={() => {
                    item.action
                      ? handleActions(item.action)
                      : navigate(item.path);
                    toggleMenu();
                  }}
                >
                  <div className={styles.navItemContent}>
                    <FontAwesomeIcon icon={item.icon} />
                    <span>{item.label}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default MobileNavigation;
