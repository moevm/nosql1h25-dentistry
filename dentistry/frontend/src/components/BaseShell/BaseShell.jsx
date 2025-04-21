import styles from "./BaseShell.module.css";

const BaseShell = ({ children, isHeader = true }) => (
  <div className={styles.wrapper}>
    {isHeader && (
      <header className={styles.header}>
        <h1 className={styles.header_title}>Стоматология</h1>
      </header>
    )}
    <div className={styles.frame}>{children}</div>
  </div>
);

export default BaseShell;
