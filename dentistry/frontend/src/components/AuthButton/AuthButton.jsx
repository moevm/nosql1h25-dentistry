import styles from "./AuthButton.module.css";

const AuthButton = ({ children, type = "submit", onClick, disabled }) => (
  <button
    type={type}
    className={styles.button}
    onClick={onClick}
    disabled={disabled}
  >
    {children}
  </button>
);

export default AuthButton;
