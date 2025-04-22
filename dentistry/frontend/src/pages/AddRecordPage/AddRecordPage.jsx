import clsx from "clsx";
import BigButton from "../../components/BigButton";
import styles from "./AddRecordPage.module.css";
import AddFormInputField from "../../components/inputs/AddFormInputField";

const AddRecordPage = () => (
  <div className={styles.wrapper}>
    <h2 className={styles.title}>Создание записи</h2>
    <div className={styles.frame}>
      <div className={styles.image}>
        <img src="https://placehold.co/400x400.png" alt="doctor" />
      </div>
      <form action="submit" className={styles.form}>
        <div className={styles.field_container}>
          <AddFormInputField label="Услуга" type="text" />
          <AddFormInputField label="Выберите врача" type="text" />
          <AddFormInputField label="Дата и время" type="datetime-local" />
          <AddFormInputField
            label="Дополнительная информация"
            type="textarea"
          />
        </div>
        <div className={styles.button_container}>
          <BigButton>Записаться</BigButton>
        </div>
      </form>
    </div>
  </div>
);

export default AddRecordPage;
