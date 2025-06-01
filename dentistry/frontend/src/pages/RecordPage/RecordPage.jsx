// import React, { useEffect, useState } from "react";
// import { Link, useParams } from "react-router-dom";
// import styles from "./RecordPage.module.css";
// import RecordCard from "../../components/RecordCard";
// import FilterInputField from "../../components/inputs/FilterInputField";
// import Button from "../../components/Button";
// import OnlyRole from "../../components/OnlyRole";
// import defaultAvatar from "../../assets/images/img.png";
// import Popup from "../../components/popups/Popup";
// import useRecordById from "../../hooks/apiHooks/useRecordById";
// import apiService from "../../services/apiService";
// import { useUser } from "../../context/UserContext";

// const titles = {
//   patient: "Запись на прием",
//   specialist: "Запись на прием",
//   admin: "Запись на прием",
// };

// const addRecordButtonTitles = {
//   patient: "Записаться на прием",
//   specialist: "Записать пациента",
//   admin: "Записать пациента",
// };

// const RecordPage = () => {
//   const { id } = useParams();
//   const { data: record, loading, error } = useRecordById(id);

//   console.log("record:", record);

//   if (loading) return <div>Загрузка...</div>;
//   if (error) return <div>Ошибка: {error}</div>;
//   if (!record) return <div>Запись не найдена</div>;

//   return (
//     <div style={{ maxWidth: "800px", margin: "0 auto" }}>
//       <h2>Запись №{record.id}</h2>
//       <p><strong>Дата:</strong> {new Date(record.date).toLocaleString()}</p>
//       <p><strong>Пациент:</strong> {record.patient?.full_name || "Не указан"}</p>
//       <p><strong>Специалист:</strong> {record.dentist?.full_name || "Не указан"}</p>
//       <p><strong>Услуга:</strong> {record.service || "Не указана"}</p>
//       <p><strong>Статус:</strong> {record.status || "Не указан"}</p>
//       <p><strong>Комментарий:</strong> {record.comment || "Нет"}</p>
//     </div>
//   );
// };

// export default RecordPage;

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./RecordPage.module.css";
import defaultAvatar from "../../assets/images/img.png";
import apiService from "../../services/apiService";
import { useUser } from "../../context/UserContext";

const RecordPage = () => {
  const { id } = useParams();
  const [record, setRecord] = useState(null);
  const [patient, setPatient] = useState(null);
  const [dentist, setDentist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    // Сначала загружаем запись
    apiService.getRecordById(id)
      .then(({ data }) => {
        setRecord(data);
        return data;
      })
      .then((recordData) => {
        // Если есть patient, загружаем данные пациента
        if (recordData.patient) {
          apiService.getClientById(recordData.patient)
            .then(({ data }) => setPatient(data))
            .catch(() => setPatient(null));
        } else {
          setPatient(null);
        }
        // Если есть dentist, загружаем данные стоматолога
        if (recordData.dentist) {
          apiService.getDentistById(recordData.dentist)
            .then(({ data }) => setDentist(data))
            .catch(() => setDentist(null));
        } else {
          setDentist(null);
        }
      })
      .catch((err) => setError(err.message || "Ошибка загрузки"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;
  if (!record) return <div>Запись не найдена</div>;

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <h2>Запись №{record.id}</h2>
      <p><strong>Дата:</strong> {new Date(record.appointment_date).toLocaleString()}</p>
      <p>
        <strong>Пациент:</strong>{" "}
        {patient
          ? `${patient.last_name} ${patient.first_name} ${patient.second_name || ""}`
          : "Не указан"}
      </p>
      <p>
        <strong>Специалист:</strong>{" "}
        {dentist
          ? `${dentist.last_name} ${dentist.first_name} ${dentist.second_name || ""}`
          : "Не указан"}
      </p>
      <p><strong>Статус:</strong> {record.status || "Не указан"}</p>
      <p><strong>Комментарий:</strong> {record.notes || "Нет"}</p>
    </div>
  );
};

export default RecordPage;