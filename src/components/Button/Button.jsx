import styles from "./Button.module.scss";

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Button = ({
  icon = null,
  variant = "default",
  circle: _circle = false,
  outline: _outline = false,
  children,
  onClick,
  size,
  className = "",
  iconStyle = "",
  disabled = false,
}) => {
  const getIcon = (icon) => {
    if (!icon) return null;
    if (typeof icon === "function") {
      //if Tabler Icon
      const Icon = icon;
      return <Icon style={{ width: "100%", height: "100%" }} />;
    }
    if (typeof icon === "object") {
      return <FontAwesomeIcon icon={icon} className={iconStyle} />;
    }
  };

  const circle = _circle ? styles.circle : "";
  const outline = _outline ? styles.outline : "";

  return (
    <button
      disabled={disabled}
      className={`${styles.btn} ${styles[variant]} ${styles[size]} ${className} ${circle} ${outline}`}
      onClick={onClick}
    >
      <span>{children}</span> {getIcon(icon)}
    </button>
  );
};

export default Button;
