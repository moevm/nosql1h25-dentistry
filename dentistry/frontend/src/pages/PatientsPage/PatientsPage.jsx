import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./PatientsPage.module.css";
import Card from "../../components/Card";
import FilterInputField from "../../components/inputs/FilterInputField";
import Button from "../../components/Button";
import FullNameFromUser from "../../components/FullNameFromUser";
import OnlyRole from "../../components/OnlyRole";
import { useNavigate } from "react-router-dom";

import { usePatients } from "../../hooks/apiHooks";

const PatientsPage = () => {
  const { data: data, loading, error } = usePatients();
  const navigate = useNavigate();

  const handleAddPatient = (e) => {
    e.preventDefault();
    // redirect to add Patient page
    navigate("/add-patient");
  };

  const handleExportPatients = (e) => {
    e.preventDefault();
  };

  return (
    <>
      <div className={styles.header}>
        <h2 className={styles.title}>Наши пациенты</h2>
        <OnlyRole role={"admin"}>
          <Button className={styles.button} onClick={handleAddPatient}>
            Добавить пациента
          </Button>
        </OnlyRole>
        <OnlyRole role={"admin"}>
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
        ) : data.length === 0 ? (
          <div className={styles.empty}>Нет записей</div>
        ) : (
          data.map((el) => (
            <Card
              key={el.id}
              image={el.avatar}
              description={<FullNameFromUser user={el} />}
              buttonText={"Подробнее о пациенте"}
            />
          ))
        )}
      </div>
    </>
  );
};

export default PatientsPage;
