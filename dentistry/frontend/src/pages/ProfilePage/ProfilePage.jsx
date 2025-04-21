import Button from "../../components/Button";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import styles from "./ProfilePage.module.css";

const ProfilePage = () => {
  const { data: user, loading, error } = useCurrentUser();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Профиль</h2>
      <div className={styles.content}>
        <div className={styles.avatar}>
          <img src={user.avatar} alt="Avatar" />
        </div>
        <div className={styles.info}>
          <h3 className={styles.fieldTitle}>
            {user.surname} {user.name} {user.patronymic}
          </h3>
          <div className={styles.fields}>
            <div className={styles.fieldItem}>
              <div className={styles.fieldLabel}>Номер телефона</div>
              <div className={styles.fieldValue}>
                {user.phone || "Не указан"}
              </div>
            </div>
            <div className={styles.fieldItem}>
              <div className={styles.fieldLabel}>Пол</div>
              <div className={styles.fieldValue}>
                {user.gender || "Не указан"}
              </div>
            </div>{" "}
            <div className={styles.fieldItem}>
              <div className={styles.fieldLabel}>Дата рождения</div>
              <div className={styles.fieldValue}>
                {new Date(user.birthday).toLocaleDateString() || "Не указана"}
              </div>
            </div>{" "}
            <div className={styles.fieldItem}>
              <div className={styles.fieldLabel}>E-mail адрес</div>
              <div className={styles.fieldValue}>
                {user.email || "Не указан"}
              </div>
            </div>
          </div>
          <div className={styles.actions}>
            <Button>Редактировать</Button>
            <Button>Сменить пароль</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
