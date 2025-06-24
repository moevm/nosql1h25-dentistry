import styles from "./SpecialistsPage.module.css";
import Card from "../../components/Card";
import Button from "../../components/Button";
import FullNameFromUser from "../../components/FullNameFromUser";
import OnlyRole from "../../components/OnlyRole";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import { useSpecialists } from "../../hooks/apiHooks";
import defaultAvatar from "../../assets/images/img.png"; // путь до запасного изображения

const SpecialistsPage = () => {
  const [page, setPage] = useState(1);
  const limit = 10;
  const { results, count, loading, error } = useSpecialists({}, page, limit);
  const navigate = useNavigate();

  const handleAddSpecialist = (e) => {
    e.preventDefault();
    navigate("/add-specialist");
  };

  const handleExportSpecialists = (e) => {
    e.preventDefault();
  };

  const handleSpecialistClick = (id) => {
    navigate(`/specialists/${id}`);
  };

  const totalPages = Math.ceil(count / limit);

  return (
    <>
      <div className={styles.header}>
        <h2 className={styles.title}>Наши врачи</h2>
        <OnlyRole role="admin">
          <Button className={styles.button} onClick={handleAddSpecialist}>
            Добавить врача
          </Button>
        </OnlyRole>
        <OnlyRole role="admin">
          <Button className={styles.button} onClick={handleExportSpecialists}>
            Выгрузить информацию о врачах
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
              title={el.additional_info?.profession || "Специальность не указана"}
              description={<FullNameFromUser user={el} />}
              buttonText="Подробнее о враче"
              onClick={(e) => {
                e.preventDefault();
                handleSpecialistClick(el.id);
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

export default SpecialistsPage;
