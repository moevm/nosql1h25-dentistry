import styles from "./SpecialistRecordsPage.module.css";
import RecordCard from "../../../components/RecordCard";
import FilterInputField from "../../../components/FilterInputField";
import Button from "../../../components/Button";
import { Link } from "react-router-dom";

const SpecialistRecordsPage = () => (
  <>
      <h2 className={styles.title}>Записи</h2>
      <Link to="/add_record" className={styles.big_button}>Записать пациента</Link>
      <div className={styles.filters}>
        <FilterInputField
          label={"Диапозон с"}
          type="date"
          placeholder="дд.мм.гггг"
        />
        <FilterInputField label={"до"} type="date" placeholder="дд.мм.гггг" />
        <FilterInputField placeholder="Поиск по врачу" type="search" />
        <label>
          <input type="checkbox" />
          <span>Прошедшие записи</span>
        </label>
        <div className={styles.filter_button}>
          <Button>Применить</Button>
        </div>
      </div>
      <div className={styles.card_container}>
        {Array.from({ length: 9 }).map((_, index) => (
          <RecordCard
            key={index}
            image={"https://placehold.co/192x200.png"}
            service_name={"Лечение кариеса"}
            fullname={"Иванов Иван Иванович"}
            iso_date={"2025-02-18T14:00:00.000Z"}
          />
        ))}
      </div>
  </>
);

export default SpecialistRecordsPage;
