import { Link } from "react-router-dom";
import styles from "./PageHeader.module.css";

const PageHeader = ({ links }) => (
  <header className={styles.header}>
    <Link className={styles.back_link}>Назад</Link>
    <h1 className={styles.header_title}>Стоматология</h1>
    {links.map(({ to, label }, index) => (
      <Link key={index} to={to} className={styles.header_link}>
        {label}
      </Link>
    ))}
  </header>
);

export default PageHeader;
