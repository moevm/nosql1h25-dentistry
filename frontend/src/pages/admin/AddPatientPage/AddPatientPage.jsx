import { useState, useRef, useEffect } from "react";
import BigButton from "../../../components/BigButton";
import styles from "./AddPatientPage.module.css";
import AddFormInputField from "../../../components/inputs/AddFormInputField";
import { useAddClient, useBulkAddClients } from "../../../hooks/apiHooks";

const AddPatientPage = () => {
  const { addClient, loading, success } = useAddClient();
  const { bulkAddClients } = useBulkAddClients();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    birthDate: "",
    phone: "",
    additionalInfo: "",
    avatar: "",
  });

  useEffect(() => {
    if (success) {
      setFormData({
        name: "",
        birthDate: "",
        phone: "",
        additionalInfo: "",
        avatar: "",
      });
    }
  }, [success]);

  const [file, setFile] = useState(null);

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleAvatarChange = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, avatar: reader.result }));
    };
    if (file) reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    const payload = {
      ...formData,
      birthDate: new Date(formData.birthDate).toISOString(),
    };

    addClient(payload);
  };

  const handleFileChange = (file) => {
    if (file) {
      setFile(file);
    }
  };

  const handleBulk = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Пожалуйста, выберите файл для загрузки.");
      return;
    }
    bulkAddClients(file);
  };

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Добавление пациента</h2>
      <div className={styles.frame}>
        <div
          className={styles.image}
          onClick={() => fileInputRef.current.click()}
        >
          <img
            src={formData.avatar || "https://placehold.co/400x400.png"}
            alt="avatar"
          />
        </div>
        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={(e) => handleAvatarChange(e.currentTarget.files[0])}
          />
          <div className={styles.field_container}>
            <AddFormInputField
              label="ФИО"
              type="text"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
            <AddFormInputField
              label="Дата рождения"
              type="date"
              value={formData.birthDate}
              onChange={(e) => handleChange("birthDate", e.target.value)}
            />
            <AddFormInputField
              label="Телефон"
              type="phone"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
            />
            <AddFormInputField
              label="Дополнительная информация"
              type="textarea"
              value={formData.additionalInfo}
              onChange={(e) => handleChange("additionalInfo", e.target.value)}
              required={false}
            />
          </div>
          <div className={styles.button_container}>
            {loading && <p>Загрузка...</p>}
            {success && <p>Успешно</p>}
            <BigButton>Добавить пациента</BigButton>
          </div>
        </form>
      </div>
      <form className={styles.mass_form}>
        <AddFormInputField
          label="Массовая загрузка"
          type="file"
          className={styles.mass_form__field}
          onChange={(e) => handleFileChange(e.currentTarget.files[0])}
        />
        <div className={styles.mass_form__button_container}>
          <BigButton onClick={handleBulk}>Загрузить базу</BigButton>
        </div>
      </form>
    </div>
  );
};

export default AddPatientPage;
