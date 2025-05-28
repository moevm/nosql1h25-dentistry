import { useState, useEffect } from "react";
import BigButton from "../../components/BigButton";
import styles from "./AddRecordPage.module.css";
import AddFormInputField from "../../components/inputs/AddFormInputField";
import useAddRecord from "../../hooks/useAddRecord";
import apiService from "../../services/apiService"; // путь поправь, если нужно

const AddRecordPage = () => {
  const [formData, setFormData] = useState({
    service: "",
    dentist: "",
    appointment_date: "",
    notes: "",
  });

  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [errorDoctors, setErrorDoctors] = useState(null);

  const { addRecord, loading, error } = useAddRecord();

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoadingDoctors(true);
      setErrorDoctors(null);
      try {
        const response = await apiService.getDentists();
        setDoctors(response.data.results || []);
      } catch (err) {
        setErrorDoctors("Ошибка загрузки списка врачей");
        console.error(err);
      } finally {
        setLoadingDoctors(false);
      }
    };

    fetchDoctors();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const currentUserId = localStorage.getItem("user_id");
      const recordPayload = {
        dentist: parseInt(formData.dentist),
        patient: parseInt(currentUserId),
        appointment_date: formData.appointment_date,
        notes: formData.notes,
        duration: 30,
      };

      await addRecord(recordPayload);
      alert("Запись успешно создана!");
      setFormData({
        service: "",
        dentist: "",
        appointment_date: "",
        notes: "",
      });
    } catch (err) {
      console.error("Ошибка при создании записи:", err);
    }
  };

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Создание записи</h2>
      <div className={styles.frame}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field_container}>
            <AddFormInputField
              label="Услуга"
              name="service"
              type="text"
              value={formData.service}
              onChange={handleChange}
            />

            <label className={styles.label} htmlFor="dentist">
              Врач
            </label>
            {loadingDoctors ? (
              <p>Загрузка врачей...</p>
            ) : errorDoctors ? (
              <p className={styles.error}>{errorDoctors}</p>
            ) : (
              <select
                id="dentist"
                name="dentist"
                value={formData.dentist}
                onChange={handleChange}
                className={styles.select}
                required
              >
                <option value="" disabled>
                  Выберите врача
                </option>
                {doctors.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.first_name} {doc.last_name} — {doc.additional_info?.profession || ""}
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
