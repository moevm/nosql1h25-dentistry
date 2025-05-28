import { Link } from "react-router-dom";
import styles from "./MainPage.module.css";
import { useUser } from "../../context/UserContext";
import { useAccessToken } from "../../hooks/useAccessToken";

const MainPage = ({ title, first_link_list, second_list_link }) => {
  const { user, removeUser } = useUser();
  const { removeAccessToken } = useAccessToken();

  const handleLogout = () => {
    removeUser();
    removeAccessToken();
  };

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <h1 className={styles.header__title}>Стоматология</h1>
        <h2 className={styles.header__subtitle}>{title}</h2>
        <button className={styles.logout} onClick={handleLogout}>
          Выйти из аккаунта
        </button>
      </header>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.content__column}>
            {first_link_list?.map((link, index) => (
              <Link key={index} className={styles.link} to={link.to}>
                {link.name}
              </Link>
            ))}
          </div>
          <div className={styles.content__column}>
            {second_list_link?.map((link, index) => (
              <Link key={index} className={styles.link} to={link.to}>
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default MainPage;
