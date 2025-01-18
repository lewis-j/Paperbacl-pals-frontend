import styles from "./NoContent.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";

const NoContent = ({ children, icon, text }) => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowSize.width < 768;

  const getIcon = (icon) => {
    if (typeof icon === "function") {
      const Icon = icon;
      return (
        <Icon
          style={{
            width: "100%",
            height: "100%",
            fontSize: isMobile ? "3em" : "6em",
          }}
        />
      );
    }
    if (typeof icon === "object") {
      return (
        <FontAwesomeIcon
          icon={icon}
          size={"5x"}
          style={{
            fontSize: isMobile ? "3em" : "6em",

            width: "100%",
          }}
        />
      );
    }
  };

  return (
    <div className={`${styles.container}`}>
      <div className={styles.iconWrapper}>{getIcon(icon)}</div>
      <div className={styles.text}>{text}</div>
      {children && <div className={styles.children}>{children}</div>}
    </div>
  );
};

export default NoContent;
