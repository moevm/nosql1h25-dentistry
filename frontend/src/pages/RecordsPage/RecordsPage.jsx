import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./RecordsPage.module.css";
import RecordCard from "../../components/RecordCard";
import FilterInputField from "../../components/inputs/FilterInputField";
import Button from "../../components/Button";
import OnlyRole from "../../components/OnlyRole";
import Popup from "../../components/popups/Popup";

import {
  useRecords,
  usePatchRecordById,
  useDeleteRecordById,
} from "../../hooks/apiHooks";

import { useUser } from "../../context/UserContext";

const titles = {
  patient: "Мои записи",
  specialist: "Записи",
  admin: "Записи",
};

const addRecordButtonTitles = {
  patient: "Записаться на прием",
  specialist: "Записать пациента",
  admin: "Записать пациента",
};

const RecordsPage = () => {
  const { user } = useUser();

  const [draft, setDraft] = useState({
    date_from: "",
    date_to: "",
    specialist: "",
    patient: user.role === "patient" ? user.id : "",
    showPast: false,
  });
  const [filters, setFilters] = useState(draft);

  const handleClickApply = () => {
    setFilters(draft);
  };

  const { data: records, loading, error } = useRecords(filters);
  const { patchRecordById } = usePatchRecordById();
  const { deleteRecordById } = useDeleteRecordById();

  const [selectedRecord, setSelectedRecord] = useState(null);
  const [stageRecord, setStageRecord] = useState(null);

  const handleSelectCard = (record) => {
    return (e) => {
      e.preventDefault();
      setSelectedRecord(record);
      setStageRecord("selected");
    };
  };

  const handleCloseMoveOrCancelRecordPopup = (e) => {
    e.preventDefault();
    setSelectedRecord(null);
    setStageRecord(null);
  };

  const handleMoveRecord = (e) => {
    e.preventDefault();
    setStageRecord("move");
  };

  const handleOpenCancelRecordPopup = (e) => {
    e.preventDefault();
    setStageRecord("cancel");
  };

  const handleCancelRecord = (e) => {
    e.preventDefault();
    deleteRecordById(selectedRecord.id);
    setStageRecord(null);
  };

  const moveToNewDateTime = (dateTime) => {
    patchRecordById(selectedRecord.id, {
      appointment_date: dateTime.toISOString(),
    });
    console.log("Move record to:", dateTime);
    setStageRecord(null);
  };

  return (
    <>
      <h2 className={styles.title}>{titles[user.role]}</h2>
      <Link to={"/add_record"} className={styles.big_button}>
        {addRecordButtonTitles[user.role]}
      </Link>
      <div className={styles.filters}>
        <FilterInputField
          label={"Диапозон с"}
          type="date"
          value={draft.date_from}
          placeholder="дд.мм.гггг"
          onChange={(e) => setDraft({ ...draft, date_from: e.target.value })}
        />
        <FilterInputField
          label={"до"}
          type="date"
          placeholder="дд.мм.гггг"
          value={draft.date_to}
          onChange={(e) => setDraft({ ...draft, date_to: e.target.value })}
        />
        <FilterInputField
          placeholder="Поиск по врачу"
          type="search"
          value={draft.specialist}
          onChange={(e) => setDraft({ ...draft, specialist: e.target.value })}
        />
        <OnlyRole role={["admin", "specialist"]}>
          <FilterInputField
            placeholder="Поиск по пациенту"
            type="search"
            value={draft.specialist}
            onChange={(e) => setDraft({ ...draft, patient: e.target.value })}
          />
        </OnlyRole>
        <label>
          <input
            type="checkbox"
            checked={draft.showPast}
            onChange={(e) => setDraft({ ...draft, showPast: e.target.checked })}
          />
          <span>Прошедшие записи</span>
        </label>
        <div className={styles.filter_button}>
          <Button onClick={handleClickApply}>Применить</Button>
        </div>
      </div>
      <div className={styles.card_container}>
        {loading ? (
          <div className={styles.loading}>Загрузка...</div>
        ) : error ? (
          <div className={styles.error}>Ошибка: {error}</div>
        ) : records.length === 0 ? (
          <div className={styles.empty}>Нет записей</div>
        ) : (
          records.map((record) => (
            <RecordCard
              key={record.id}
              image={record.dentist?.avatar}
              service_name={record.service?.name}
              fullname={`${record.dentist.surname} ${record.dentist.name} ${record.dentist.patronymic}`}
              iso_date={record.appointment_date}
              onClick={handleSelectCard(record)}
            />
          ))
        )}
      </div>
      {stageRecord === "selected" && (
        <MoveOrCancelRecordPopup
          onClose={handleCloseMoveOrCancelRecordPopup}
          handleMoveRecord={handleMoveRecord}
          handleCancelRecord={handleOpenCancelRecordPopup}
        />
      )}
      {stageRecord === "cancel" && (
        <CancelRecordPopup
          onClose={handleCloseMoveOrCancelRecordPopup}
          handleCancelRecord={handleCancelRecord}
        />
      )}
      {stageRecord === "move" && (
        <MoveRecordPopup
          onClose={handleCloseMoveOrCancelRecordPopup}
          moveToNewDateTime={moveToNewDateTime}
        />
      )}
    </>
  );
};

export default RecordsPage;

const MoveOrCancelRecordPopup = ({
  onClose,
  handleMoveRecord,
  handleCancelRecord,
}) => {
  return (
    <Popup isOpen={false} onClose={onClose} onSubmit={() => {}}>
      <div className={styles.popup_buttons}>
        <Button onClick={handleMoveRecord}>Перенос</Button>
        <Button onClick={handleCancelRecord}>Отменить запись</Button>
        <Button onClick={onClose}>Отмена</Button>
      </div>
    </Popup>
  );
};

const CancelRecordPopup = ({ onClose, handleCancelRecord }) => {
  return (
    <Popup isOpen={false} onClose={onClose} onSubmit={() => {}}>
      <div className={styles.popup_text}>Отменить запись?</div>
      <div className={styles.popup_buttons}>
        <Button onClick={handleCancelRecord}>Да</Button>
        <Button onClick={onClose}>Нет</Button>
      </div>
    </Popup>
  );
};

const MoveRecordPopup = ({ onClose, moveToNewDateTime }) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedDate && selectedTime) {
      const newDateTime = new Date(`${selectedDate}T${selectedTime}:00`);
      moveToNewDateTime(newDateTime);
      onClose();
    } else {
    }
  };

  return (
    <Popup isOpen={false} onClose={onClose} onSubmit={() => {}}>
      <h3>Дата</h3>
      {["2025-05-05", "2025-05-06", "2025-05-07", "2025-05-10"].map((date) => (
        <button key={date} onClick={() => setSelectedDate(date)}>
          {new Date(date).toLocaleDateString()}
        </button>
      ))}

      <h3>Время</h3>
      {["14:00", "16:00", "18:00"].map((time) => (
        <button key={time} onClick={() => setSelectedTime(time)}>
          {time}
        </button>
      ))}

      <button onClick={handleSubmit}>Подтвердить</button>
      <button onClick={onClose}>Отмена</button>
    </Popup>
  );
};
