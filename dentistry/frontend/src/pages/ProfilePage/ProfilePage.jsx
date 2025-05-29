import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Button from "../../components/Button";
import { useCurrentUser, useUserById } from "../../hooks/apiHooks";
import apiService from "../../services/apiService";
import styles from "./ProfilePage.module.css";
import defaultAvatar from "../../assets/images/img.png";

const titles = {
  user: "Профиль",
  specialist: "Врач",
  admin: "Администратор",
  patient: "Пациент",
};

const additionalLabels = {
  profession: "Профессия",
  work_experience: "Опыт работы",
};

const ProfilePage = ({ userRole }) => {
  const { id } = useParams();
  const userId = id ? parseInt(id) : undefined;

  const { data: userById, loading: loadingById, error: errorById } = userId
    ? useUserById({ id: userId, role: userRole })
    : { data: null, loading: false, error: null };

  const { data: currentUser, loading: loadingCurrent, error: errorCurrent } =
    !userId ? useCurrentUser() : { data: null, loading: false, error: null };

  const user = userId ? userById : currentUser;
  const loading = userId ? loadingById : loadingCurrent;
  const error = userId ? errorById : errorCurrent;

  const isMyProfile = userId === undefined;

  const [isEditing, setIsEditing] = useState(false);

  // Локальный стейт для формы, инициализируем при загрузке пользователя
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    second_name: "",
    phone: "",
    gender: "",
    birth_date: "",
    email: "",
    additional_info: {},
  });

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        second_name: user.second_name || "",
        phone: user.phone || "",
        gender: user.gender || "",
        birth_date: user.birth_date ? user.birth_date.slice(0, 10) : "", // формат yyyy-mm-dd для input date
        email: user.email || "",
        additional_info: {
          profession: user.additional_info?.profession || "",
          work_experience: user.additional_info?.work_experience || "",
        },
      });
    }
  }, [user]);

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;
  if (!user) return <div>Пользователь не найден</div>;

  // Обработчик изменения в форме
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("additional_info.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        additional_info: {
          ...prev.additional_info,
          [key]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Отправка данных на сервер
  const handleSave = async () => {
    try {
      const dataToSend = {
        ...formData,
        additional_info: formData.additional_info,
      };

      if (isMyProfile) {
        // редактируем текущего пользователя
        if (userRole === "patient") {
          await apiService.patchCurrentClient(dataToSend);
        } else {
          await apiService.patchCurrentDentist(dataToSend);
        }
      } else {
        // редактируем пользователя по id (для админов, например)
        if (userRole === "patient") {
          await apiService.patchClientById(userId, dataToSend);
        } else {
          await apiService.patchDentistById(userId, dataToSend);
        }
      }
      setIsEditing(false);
      // Можно обновить данные вручную или через рефетч
      window.location.reload(); // простой способ обновить страницу после сохранения
    } catch (err) {
      alert("Ошибка при сохранении: " + err.message);
      console.error(err);
    }
  };

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
          {!isEditing ? (
            <>
              <h3 className={styles.fieldTitle}>
                {user.last_name} {user.first_name} {user.second_name}
              </h3>
              <div className={styles.fields}>
                <div className={styles.fieldItem}>
                  <div className={styles.fieldLabel}>Номер телефона</div>
                  <div className={styles.fieldValue}>{user.phone || "Не указан"}</div>
                </div>
                <div className={styles.fieldItem}>
                  <div className={styles.fieldLabel}>Пол</div>
                  <div className={styles.fieldValue}>{user.gender || "Не указан"}</div>
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
                  <div className={styles.fieldValue}>{user.email || "Не указан"}</div>
                </div>

                {Object.entries(user.additional_info || {}).map(
                  ([key, value]) =>
                    value && (
                      <div className={styles.fieldItem} key={key}>
                        <div className={styles.fieldLabel}>
                          {additionalLabels[key] ||
                            key.charAt(0).toUpperCase() +
                              key.slice(1).replace(/_/g, " ")}
                        </div>
                        <div className={styles.fieldValue}>{value}</div>
                      </div>
                    )
                )}
              </div>
              {isMyProfile && (
                <div className={styles.actions}>
                  <Button onClick={() => setIsEditing(true)}>Редактировать</Button>
                  <Button>Сменить пароль</Button>
                </div>
              )}
            </>
          ) : (
            <>
              <h3 className={styles.fieldTitle}>Редактировать профиль</h3>
              <div className={styles.fields}>
                <div className={styles.fieldItem}>
                  <label className={styles.fieldLabel} htmlFor="last_name">
                    Фамилия
                  </label>
                  <input
                    type="text"
                    id="last_name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    className={styles.input}
                  />
                </div>
                <div className={styles.fieldItem}>
                  <label className={styles.fieldLabel} htmlFor="first_name">
                    Имя
                  </label>
                  <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    className={styles.input}
                  />
                </div>
                <div className={styles.fieldItem}>
                  <label className={styles.fieldLabel} htmlFor="second_name">
                    Отчество
                  </label>
                  <input
                    type="text"
                    id="second_name"
                    name="second_name"
                    value={formData.second_name}
                    onChange={handleChange}
                    className={styles.input}
                  />
                </div>
                <div className={styles.fieldItem}>
                  <label className={styles.fieldLabel} htmlFor="phone">
                    Номер телефона
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={styles.input}
                  />
                </div>
                <div className={styles.fieldItem}>
                  <label className={styles.fieldLabel} htmlFor="gender">
                    Пол
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className={styles.input}
                  >
                    <option value="">Не указан</option>
                    <option value="male">Мужской</option>
                    <option value="female">Женский</option>
                    <option value="other">Другой</option>
                  </select>
                </div>
                <div className={styles.fieldItem}>
                  <label className={styles.fieldLabel} htmlFor="birth_date">
                    Дата рождения
                  </label>
                  <input
                    type="date"
                    id="birth_date"
                    name="birth_date"
                    value={formData.birth_date}
                    onChange={handleChange}
                    className={styles.input}
                  />
                </div>
                <div className={styles.fieldItem}>
                  <label className={styles.fieldLabel} htmlFor="email">
                    E-mail адрес
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={styles.input}
                  />
                </div>

                {/* Дополнительные поля */}
                <div className={styles.fieldItem}>
                  <label
                    className={styles.fieldLabel}
                    htmlFor="additional_info.profession"
                  >
                    Профессия
                  </label>
                  <input
                    type="text"
                    id="additional_info.profession"
                    name="additional_info.profession"
                    value={formData.additional_info.profession}
                    onChange={handleChange}
                    className={styles.input}
                  />
                </div>
                <div className={styles.fieldItem}>
                  <label
                    className={styles.fieldLabel}
                    htmlFor="additional_info.work_experience"
                  >
                    Опыт работы
                  </label>
                  <input
                    type="text"
                    id="additional_info.work_experience"
                    name="additional_info.work_experience"
                    value={formData.additional_info.work_experience}
                    onChange={handleChange}
                    className={styles.input}
                  />
                </div>
              </div>

              <div className={styles.actions}>
                <Button onClick={handleSave}>Сохранить</Button>
                <Button onClick={() => setIsEditing(false)}>Отмена</Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
