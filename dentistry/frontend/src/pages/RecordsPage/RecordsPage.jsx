import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./RecordsPage.module.css";
import RecordCard from "../../components/RecordCard";
import FilterInputField from "../../components/inputs/FilterInputField";
import Button from "../../components/Button";
import OnlyRole from "../../components/OnlyRole";
import defaultAvatar from "../../assets/images/img.png";
import Popup from "../../components/popups/Popup";
import apiService from "../../services/apiService";
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

  const [filters, setFilters] = useState({
    date_from: "",
    date_to: "",
    specialist: "",
    patient: user.role === "patient" ? user.id : "",
    showPast: false,
  });

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [dentists, setDentists] = useState({});
  const [patients, setPatients] = useState({});

  const [selectedRecord, setSelectedRecord] = useState(null);
  const [stageRecord, setStageRecord] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    apiService.getRecords({
      date_from: filters.date_from,
      date_to: filters.date_to,
      specialist: filters.dentist_name,
      patient_name: filters.patient_name, //
      show_past: filters.showPast,
    })
      .then(res => setRecords(res.data.results || []))
      .catch(err => setError(err.message || "Ошибка загрузки"))
      .finally(() => setLoading(false));
  }, [filters]);

  useEffect(() => {
    if (!records.length) return;

    const dentistIds = Array.from(new Set(records.map(r => r.dentist).filter(Boolean)));
    Promise.all(
      dentistIds
        .filter(id => !dentists[id])
        .map(id => apiService.getDentistById(id).then(res => res.data))
    ).then(arr => {
      if (arr.length) {
        setDentists(prev => {
          const dict = { ...prev };
          arr.forEach(d => { dict[d.id] = d; });
          return dict;
        });
      }
    });

    const patientIds = Array.from(new Set(records.map(r => r.patient).filter(Boolean)));
    Promise.all(
      patientIds
        .filter(id => !patients[id])
        .map(id => apiService.getClientById(id).then(res => res.data))
    ).then(arr => {
      if (arr.length) {
        setPatients(prev => {
          const dict = { ...prev };
          arr.forEach(d => { dict[d.id] = d; });
          return dict;
        });
      }
    });
  }, [records]);

  const handleSelectCard = (record) => (e) => {
    e.preventDefault();
    setSelectedRecord(record);
    setStageRecord("selected");
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
    apiService.deleteRecordById(selectedRecord.id).then(() => {
      setRecords(prev => prev.filter(r => r.id !== selectedRecord.id));
      setStageRecord(null);
    });
  };

  const moveToNewDateTime = (dateTime) => {
    apiService.patchRecordById(selectedRecord.id, {
      appointment_date: dateTime.toISOString(),
    }).then(() => setStageRecord(null));
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
          value={filters.date_from}
          placeholder="дд.мм.гггг"
          onChange={(e) => setFilters(prev => ({ ...prev, date_from: e.target.value }))}
        />
        <FilterInputField
          label={"до"}
          type="date"
          placeholder="дд.мм.гггг"
          value={filters.date_to}
          onChange={(e) => setFilters(prev => ({ ...prev, date_to: e.target.value }))}
        />
        <OnlyRole role={["admin", "patient", "specialist"]}>
          <FilterInputField
            placeholder="Поиск по врачу"
            type="search"
            value={filters.dentist_name}
            onChange={(e) => setFilters(prev => ({ ...prev, dentist_name: e.target.value }))}
          />
        </OnlyRole>
        <OnlyRole role={["admin", "specialist"]}>
          <FilterInputField
            placeholder="Поиск по пациенту"
            type="search"
            value={filters.patient_name}
            onChange={(e) => setFilters(prev => ({ ...prev, patient_name: e.target.value }))}
          />
        </OnlyRole>
        <label>
          <input
            type="checkbox"
            checked={filters.showPast}
            onChange={(e) => setFilters(prev => ({ ...prev, showPast: e.target.checked }))}
          />
          <span>Прошедшие записи</span>
        </label>
      </div>
      <div className={styles.card_container}>
        {loading ? (
          <div className={styles.loading}>Загрузка...</div>
        ) : error ? (
          <div className={styles.error}>Ошибка: {error}</div>
        ) : !records.length ? (
          <div className={styles.empty}>Нет записей</div>
        ) : (
          records.map((record) => {
            const dentist = dentists[record.dentist];
            const patient = patients[record.patient];

            const appointmentDate = new Date(record.appointment_date);
            const formattedDate = appointmentDate.toLocaleDateString();
            const formattedTime = appointmentDate.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });

            let image = defaultAvatar;
            let fullname = "";
            let serviceName = "";

            if (user.role === "patient") {
              image = dentist?.avatar || defaultAvatar;
              fullname = dentist
                ? `${dentist.last_name} ${dentist.first_name} ${dentist.second_name || ""}`
                : "Неизвестный врач";
              serviceName = dentist?.additional_info?.profession || "";
            } else {
              image = patient?.avatar || defaultAvatar;
              fullname = patient
                ? `${patient.last_name} ${patient.first_name} ${patient.second_name || ""}`
                : "Неизвестный пациент";
              serviceName = "";
            }

            return (
              <Link to={`/records/${record.id}`} key={record.id} style={{ textDecoration: "none" }}>
                <RecordCard
                  key={record.id}
                  image={image}
                  service_name={serviceName}
                  fullname={fullname}
                  iso_date={record.appointment_date}
                  extraInfo={`${formattedDate} ${formattedTime}`}
                  onClick={handleSelectCard(record)}
                />
              </Link>
            );
          })
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
    <Popup isOpen={true} onClose={onClose} onSubmit={() => {}}>
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
    <Popup isOpen={true} onClose={onClose} onSubmit={() => {}}>
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
    }
  };

  return (
    <Popup isOpen={true} onClose={onClose} onSubmit={() => {}}>
      <h3>Дата</h3>
      {["2025-05-05", "2025-05-06", "2025-05-07", "2025-05-10"].map((date) => (
        <button
          key={date}
          onClick={() => setSelectedDate(date)}
          style={{
            background: selectedDate === date ? "#eee" : "#fff",
            margin: "0 4px",
            borderRadius: "4px",
          }}
        >
          {new Date(date).toLocaleDateString()}
        </button>
      ))}

      <h3>Время</h3>
      {["14:00", "16:00", "18:00"].map((time) => (
        <button
          key={time}
          onClick={() => setSelectedTime(time)}
          style={{
            background: selectedTime === time ? "#eee" : "#fff",
            margin: "0 4px",
            borderRadius: "4px",
          }}
        >
          {time}
        </button>
      ))}

      <button onClick={handleSubmit} style={{ marginTop: 12 }}>
        Подтвердить
      </button>
      <button onClick={onClose} style={{ marginLeft: 8 }}>
        Отмена
      </button>
    </Popup>
  );
};
