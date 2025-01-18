import React from "react";
import styles from "./FadeIn.module.scss";

const FadeIn = ({ children, delay = 1000, duration = "1s" }) => {
  const _style = (index) => ({
    animationDelay: delay * index + "ms",
    animationDuration: duration,
  });

  const addFadeInProps = (element, index) => {
    // If the element is null or not a valid React element, return it as is
    if (!React.isValidElement(element)) return element;

    const newProps = {
      style: { ...(element.props.style || {}), ..._style(index) },
      className: `${element.props.className || ""} ${styles.fadeIn}`,
    };

    // If the element has children, recursively apply the fade-in to them
    if (element.props.children) {
      return React.cloneElement(element, newProps);
    }

    return React.cloneElement(element, newProps);
  };

  if (Array.isArray(children)) {
    return children.map((child, i) => addFadeInProps(child, i));
  }

  return addFadeInProps(children, 1);
};

export default FadeIn;
