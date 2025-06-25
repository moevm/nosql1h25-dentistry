import styles from "./PatientsPage.module.css";
import Card from "../../components/Card";
import Button from "../../components/Button";
import FullNameFromUser from "../../components/FullNameFromUser";
import OnlyRole from "../../components/OnlyRole";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import { usePatients } from "../../hooks/apiHooks";
import defaultAvatar from "../../assets/images/img.png"; // запасное изображение

const PatientsPage = () => {
  const [page, setPage] = useState(1);
  const limit = 10;
  const { results, count, loading, error } = usePatients({}, page, limit);
  const navigate = useNavigate();

  const handleAddPatient = (e) => {
    e.preventDefault();
    navigate("/add-patient");
  };

  const handleExportPatients = async (e) => {
    e.preventDefault();
    try {
      const response = await import("../../services/apiService").then(module => module.default);
      const exportResponse = await response.exportUsers();
      const url = window.URL.createObjectURL(new Blob([exportResponse.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `patients_export_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      alert('Ошибка при экспорте пациентов');
    }
  };

  const handlePatientClick = (id) => {
    navigate(`/patients/${id}`);
  };

  const totalPages = Math.ceil(count / limit);

  return (
    <>
      <div className={styles.header}>
        <h2 className={styles.title}>Наши пациенты</h2>
        <OnlyRole role="admin">
          <Button className={styles.button} onClick={handleAddPatient}>
            Добавить пациента
          </Button>
        </OnlyRole>
        <OnlyRole role="admin">
          <Button className={styles.button} onClick={handleExportPatients}>
            Выгрузить информацию о пациентах
          </Button>
        </OnlyRole>
      </div>
      <div className={styles.card_container}>
        {loading ? (
          <div className={styles.loading}>Загрузка...</div>
        ) : error ? (
          <div className={styles.error}>Ошибка: {error}</div>
        ) : results.length === 0 ? (
          <div className={styles.empty}>Нет записей</div>
        ) : (
          results.map((el) => (
            <Card
              key={el.id}
              image={el.avatar || defaultAvatar}
              description={<FullNameFromUser user={el} />}
              buttonText="Подробнее о пациенте"
              onClick={(e) => {
                e.preventDefault();
                handlePatientClick(el.id);
              }}
            />
          ))
        )}
      </div>
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
          <button onClick={() => setPage(page - 1)} disabled={page === 1}>Назад</button>
          {Array.from({ length: totalPages }).map((_, idx) => (
            <button
              key={idx + 1}
              onClick={() => setPage(idx + 1)}
              style={{ fontWeight: page === idx + 1 ? 'bold' : 'normal' }}
            >
              {idx + 1}
            </button>
          ))}
          <button onClick={() => setPage(page + 1)} disabled={page === totalPages}>Вперёд</button>
        </div>
      )}
    </>
  );
};

export default PatientsPage;
