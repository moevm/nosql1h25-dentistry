import styles from "./SpecialistsPage.module.css";
import Card from "../../components/Card";
import Button from "../../components/Button";
import FullNameFromUser from "../../components/FullNameFromUser";
import OnlyRole from "../../components/OnlyRole";
import { useNavigate } from "react-router-dom";

import { useSpecialists } from "../../hooks/apiHooks";

const SpecialistsPage = () => {
  const { data: data, loading, error } = useSpecialists();
  const navigate = useNavigate();

  const handleAddSpecialist = (e) => {
    e.preventDefault();
    // redirect to add specialist page
    navigate("/add-specialist");
  };

  const handleExportSpecialists = (e) => {
    e.preventDefault();
  };

  const handleSpecialistClick = (id) => {
    navigate(`/specialists/${id}`);
  };

  return (
    <>
      <div className={styles.header}>
        <h2 className={styles.title}>Наши врачи</h2>
        <OnlyRole role={"admin"}>
          <Button className={styles.button} onClick={handleAddSpecialist}>
            {" "}
            Добавить врача
          </Button>
        </OnlyRole>
        <OnlyRole role={"admin"}>
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
        ) : data.length === 0 ? (
          <div className={styles.empty}>Нет записей</div>
        ) : (
          data.map((el) => (
            <Card
              key={el.id}
              image={el.avatar}
              title={el.position || "Специальность не указана"}
              description={<FullNameFromUser user={el} />}
              buttonText={"Подробнее о враче"}
              onClick={(e) => {
                e.preventDefault();
                handleSpecialistClick(el.id);
              }}
            />
          ))
        )}
      </div>
    </>
  );
};

export default SpecialistsPage;
