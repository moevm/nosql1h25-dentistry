import styles from "./Button.module.css";
import clsx from "clsx";

const AuthButton = ({
  children,
  type = "submit",
  onClick,
  disabled,
  className,
}) => (
  <button
    type={type}
    className={clsx(styles.button, className)}
    onClick={onClick}
    disabled={disabled}
  >
    {children}
  </button>
);

export default AuthButton;
