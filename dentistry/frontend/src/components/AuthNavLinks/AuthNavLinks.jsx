import clsx from "clsx";
import { Link, useLocation } from "react-router-dom";
import styles from "./AuthNavLinks.module.css";

const AuthNavLinks = () => {
  const location = useLocation();
  const path = location.pathname;

  return (
    <div className={styles.route}>
      <Link
        to="/login"
        className={clsx(styles.route_link, path === "/login" && styles.select)}
      >
        Вход
      </Link>
      <Link
        to="/register"
        className={clsx(
          styles.route_link,
          path === "/register" && styles.select
        )}
      >
        Регистрация
      </Link>
    </div>
  );
};

export default AuthNavLinks;
