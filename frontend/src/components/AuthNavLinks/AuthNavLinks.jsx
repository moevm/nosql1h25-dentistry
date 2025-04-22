import clsx from "clsx";
import { useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./AuthNavLinks.module.css";

const AuthNavLinks = () => {
  const location = useLocation();
  const path = location.pathname;
  const loginRef = useRef(null);
  const registerRef = useRef(null);

  useEffect(() => {
    const activeRef = path === "/login" ? loginRef : registerRef;

    loginRef.current.classList.remove(styles.select);
    registerRef.current.classList.remove(styles.select);

    requestAnimationFrame(() => {
      activeRef.current.classList.add(styles.select);
    });
  }, [path]);

  return (
    <div className={styles.route}>
      <Link to="/login" ref={loginRef} className={styles.route_link}>
        Вход
      </Link>
      <Link to="/register" ref={registerRef} className={styles.route_link}>
        Регистрация
      </Link>
    </div>
  );
};

export default AuthNavLinks;
