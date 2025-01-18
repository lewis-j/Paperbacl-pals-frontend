import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import styles from "./Modal.module.scss";

const Modal = ({ children, title, onClose, isOpen, style }) => {
  useEffect(() => {
    if (!isOpen) return;

    const closeModal = (e) => {
      if (e.target.className === styles.wrapper) {
        onClose();
      }
    };
    window.addEventListener("click", closeModal);

    return () => {
      window.removeEventListener("click", closeModal);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className={styles.wrapper}>
      <div
        style={style}
        className={styles.container}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          <h3>{title}</h3>
          <span className={styles.closeBtn} onClick={() => onClose()}>
            <FontAwesomeIcon icon={faXmark} />
          </span>
        </div>
        <div className={styles.content}>{children}</div>
      </div>
    </div>,
    document.getElementById("modal-root")
  );
};

export default Modal;
