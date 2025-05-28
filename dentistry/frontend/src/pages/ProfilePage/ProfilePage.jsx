import { useParams } from "react-router-dom";
import Button from "../../components/Button";
import { useCurrentUser, useUserById } from "../../hooks/apiHooks";
import styles from "./ProfilePage.module.css";
import OnlyRole from "../../components/OnlyRole";

import defaultAvatar from "../../assets/images/img.png"; // путь до запасного изображения

const titles = {
  user: "Профиль",
  specialist: "Врач",
  admin: "Администратор",
  patient: "Пациент",
};

// Словарь для перевода ключей additional_info на русский
const additionalLabels = {
  profession: "Профессия",
  work_experience: "Опыт работы",
  // сюда можно добавить новые ключи и их переводы
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

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;

  const additionalFields = user.additional_info || {};

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>
        {isMyProfile ? titles["user"] : titles[user.role]}
      </h2>
      <div className={styles.content}>
        <div className={styles.avatar}>
          <img src={user.avatar || defaultAvatar} alt="Аватар" />
        </div>
        <div className={styles.info}>
          <h3 className={styles.fieldTitle}>
            {user.last_name} {user.first_name} {user.second_name}
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
            </div>
            <div className={styles.fieldItem}>
              <div className={styles.fieldLabel}>Дата рождения</div>
              <div className={styles.fieldValue}>
                {user.birth_date
                  ? new Date(user.birth_date).toLocaleDateString()
                  : "Не указана"}
              </div>
            </div>
            <div className={styles.fieldItem}>
              <div className={styles.fieldLabel}>E-mail адрес</div>
              <div className={styles.fieldValue}>
                {user.email || "Не указан"}
              </div>
            </div>

            {Object.entries(additionalFields).map(([key, value]) =>
              value ? (
                <div className={styles.fieldItem} key={key}>
                  <div className={styles.fieldLabel}>
                    {additionalLabels[key] || key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " ")}
                  </div>
                  <div className={styles.fieldValue}>{value}</div>
                </div>
              ) : null
            )}
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
