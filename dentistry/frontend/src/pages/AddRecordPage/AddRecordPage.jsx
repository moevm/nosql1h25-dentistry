import clsx from "clsx";
import BigButton from "../../components/BigButton";
import styles from "./AddRecordPage.module.css";

const AddRecordPage = () => (
  <div className={styles.wrapper}>
    <h2 className={styles.title}>Создание записи</h2>
    <div className={styles.frame}>
      <div className={styles.image}>
        <img src="https://placehold.co/400x400.png" alt="doctor" />
      </div>
      <form action="submit" className={styles.form}>
        <div className={styles.field_container}>
          <label className={styles.field}>
            <div className={styles.label}>Услуга</div>
            <input className={styles.input} type="text" />
          </label>
          <label className={styles.field}>
            <div className={styles.label}>Выберите врача</div>
            <input className={styles.input} type="text" />
          </label>
          <label className={styles.field}>
            <div className={styles.label}>Дата и время</div>
            <input className={styles.input} type="datetime-local" />
          </label>
          <label className={styles.field}>
            <div className={styles.label}>Дополнительная информация</div>
            <textarea className={clsx(styles.input, styles.textarea)} />
          </label>
        </div>
        <div className={styles.button_container}>
          <BigButton>Записаться</BigButton>
        </div>
      </form>
    </div>
  </div>
);

export default AddRecordPage;
