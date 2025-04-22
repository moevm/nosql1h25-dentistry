import { useParams } from "react-router-dom";
import Button from "../../components/Button";
import { useCurrentUser, useUserById } from "../../hooks/apiHooks";
import styles from "./ProfilePage.module.css";
import OnlyRole from "../../components/OnlyRole";

const titles = {
  user: "Профиль",
  specialist: "Врач",
  admin: "Администратор",
  patient: "Пациент",
};

const ProfilePage = ({ userRole }) => {
  const { id } = useParams();
  const userId = id ? parseInt(id) : undefined;
  const {
    data: user,
    loading,
    error,
  } = userId ? useUserById({ id: userId, role: userRole }) : useCurrentUser();
  const isMyProfile = userId === undefined;


  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>
        {isMyProfile ? titles["user"] : titles[user.role]}
      </h2>
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
          {isMyProfile && (
            <div className={styles.actions}>
              <Button>Редактировать</Button>
              <Button>Сменить пароль</Button>
            </div>
          )}
          <OnlyRole role={["admin", "specialist"]}>
            <Button>Медицинская карточка</Button>
          </OnlyRole>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
