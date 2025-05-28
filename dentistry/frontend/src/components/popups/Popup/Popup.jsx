import styles from "./Popup.module.css";
import { useRef } from "react";
import clsx from "clsx";

const Popup = ({ children, overlayClassName, className, onClose }) => {
  const onClickOverlay = (e) => {
    if (e.target === e.currentTarget) {
      e.stopPropagation();
      onClose(e);
    }
  };

  return (
    <div
      className={clsx(styles.overlay, overlayClassName)}
      onClick={onClickOverlay}
    >
      <div className={clsx(styles.popup, className)}>{children}</div>
    </div>
  );
};

export default Popup;
