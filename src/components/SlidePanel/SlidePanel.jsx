import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import styles from "./SlidePanel.module.scss";
import { _s } from "../../style";

const SlidePanel = ({ open = false, onClose, children }) => {
  const [isClosing, setIsClosing] = useState(false);
  const panelRef = useRef(null);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "inherit";
    }
    return () => (document.body.style.overflow = "inherit");
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const closePanel = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setIsClosing(true);
      }
    };

    document.addEventListener("mousedown", closePanel);
    return () => document.removeEventListener("mousedown", closePanel);
  }, [open]);

  if (!open) return null;

  const animStyle = isClosing ? styles.slideOut : styles.slideIn;

  return createPortal(
    <div className={styles.wrapper}>
      <div
        ref={panelRef}
        className={_s(styles.container, animStyle)}
        onAnimationEnd={() => {
          if (open && isClosing) {
            onClose();
            setIsClosing(false);
          }
        }}
      >
        <div className={styles.content}>{children}</div>
      </div>
    </div>,
    document.getElementById("slide-panel-root")
  );
};

export default SlidePanel;
