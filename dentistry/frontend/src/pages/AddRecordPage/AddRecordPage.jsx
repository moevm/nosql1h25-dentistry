import { useState, useEffect } from "react";
import BigButton from "../../components/BigButton";
import styles from "./AddRecordPage.module.css";
import AddFormInputField from "../../components/inputs/AddFormInputField";
import useAddRecord from "../../hooks/useAddRecord";
import apiService from "../../services/apiService";

const AddRecordPage = () => {
  const [formData, setFormData] = useState({
    service: "",
    selectedUserId: "",
    appointment_date: "",
    notes: "",
  });

  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [errorUsers, setErrorUsers] = useState(null);

  const [currentUser, setCurrentUser] = useState(null);
  const [loadingCurrentUser, setLoadingCurrentUser] = useState(true);
  const [errorCurrentUser, setErrorCurrentUser] = useState(null);

  const { addRecord, loading, error } = useAddRecord();

  // Загрузка текущего пользователя и определение роли
  useEffect(() => {
    const fetchCurrentUser = async () => {
      setLoadingCurrentUser(true);
      setErrorCurrentUser(null);

      try {
        // Пробуем сначала получить клиента
        let response = await apiService.getCurrentClient();
        let user = response.data;
        if (!user || !user.role_id) {
          // Если нет, пробуем получить врача
          response = await apiService.getCurrentDentist();
          user = response.data;
        }
        setCurrentUser(user);
      } catch (err) {
        setErrorCurrentUser("Ошибка загрузки данных текущего пользователя");
        console.error(err);
      } finally {
        setLoadingCurrentUser(false);
      }
    };

    fetchCurrentUser();
  }, []);

  // Загрузка списка врачей или клиентов в зависимости от роли
  useEffect(() => {
    if (!currentUser) return;

    const fetchUsers = async () => {
      setLoadingUsers(true);
      setErrorUsers(null);

      try {
        if (currentUser.role_id === 2) {
          // Пациент — загружаем врачей
          const response = await apiService.getDentists();
          setUsers(response.data.results || []);
        } else if (currentUser.role_id === 3) {
          // Врач — загружаем пациентов
          const response = await apiService.getClients();
          setUsers(response.data.results || []);
        } else {
          setUsers([]);
        }
      } catch (err) {
        setErrorUsers("Ошибка загрузки списка пользователей");
        console.error(err);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      alert("Не удалось определить текущего пользователя.");
      return;
    }

    try {
      const recordPayload = {
        service: formData.service,
        appointment_date: formData.appointment_date,
        notes: formData.notes,
        duration: 30,
      };

      if (currentUser.role_id === 2) {
        // Пациент создает запись у врача
        recordPayload.dentist = parseInt(formData.selectedUserId);
        recordPayload.patient = currentUser.id;
      } else if (currentUser.role_id === 3) {
        // Врач создает запись для пациента
        recordPayload.dentist = currentUser.id;
        recordPayload.patient = parseInt(formData.selectedUserId);
      } else {
        alert("Неизвестная роль пользователя.");
        return;
      }

      await addRecord(recordPayload);
      alert("Запись успешно создана!");
      setFormData({
        service: "",
        selectedUserId: "",
        appointment_date: "",
        notes: "",
      });
    } catch (err) {
      console.error("Ошибка при создании записи:", err);
    }
  };

  if (loadingCurrentUser) return <p>Загрузка данных пользователя...</p>;
  if (errorCurrentUser) return <p className={styles.error}>{errorCurrentUser}</p>;

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Создание записи</h2>
      <div className={styles.frame}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field_container}>
            {/* <AddFormInputField
              label="Услуга"
              name="service"
              type="text"
              value={formData.service}
              onChange={handleChange}
              required
            /> */}

            <label className={styles.label} htmlFor="selectedUserId">
              {currentUser.role_id === 2 ? "Врач" : "Клиент"}
            </label>

            {loadingUsers ? (
              <p>Загрузка списка...</p>
            ) : errorUsers ? (
              <p className={styles.error}>{errorUsers}</p>
            ) : (
              <select
              id="selectedUserId"
              name="selectedUserId"
              value={formData.selectedUserId}
              onChange={handleChange}
              className={styles.select}
              required
            >
              <option value="" disabled>
                {currentUser.role_id === 2 ? "Выберите врача" : "Выберите клиента"}
              </option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.first_name} {user.last_name}
                  {currentUser.role_id === 2 && user.additional_info?.profession
                    ? ` — ${user.additional_info.profession}`
                    : ""}
                </option>
              ))}
            </select>
            )}

            <AddFormInputField
              label="Дата и время"
              name="appointment_date"
              type="datetime-local"
              value={formData.appointment_date}
              onChange={handleChange}
              required
            />
            <AddFormInputField
              label="Дополнительная информация"
              name="notes"
              type="textarea"
              value={formData.notes}
              onChange={handleChange}
            />
          </div>
          <div className={styles.button_container}>
            <BigButton type="submit" disabled={loading}>
              {loading ? "Сохраняем..." : "Записаться"}
            </BigButton>
          </div>
          {error && <div className={styles.error}>Ошибка: {error?.detail || "неизвестно"}</div>}
        </form>
      </div>
    </div>
  );
};

export default AddRecordPage;
