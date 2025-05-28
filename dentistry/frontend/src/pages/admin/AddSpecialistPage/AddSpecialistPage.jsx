import { useState, useRef, useEffect } from "react";
import BigButton from "../../../components/BigButton";
import styles from "./AddSpecialistPage.module.css";
import AddFormInputField from "../../../components/inputs/AddFormInputField";
import { useAddDentist, useBulkAddDentists } from "../../../hooks/apiHooks";

const AddSpecialistPage = () => {
  const { addDentist, loading, success } = useAddDentist();
  const { addBulkAddDentists } = useBulkAddDentists();
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    name: "",
    birthDate: "",
    phone: "",
    position: "",
    additionalInfo: "",
    avatar: "",
  });
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (success) {
      setFormData({
        name: "",
        birthDate: "",
        phone: "",
        position: "",
        additionalInfo: "",
        avatar: "",
      });
    }
  }, [success]);

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

    const payload = {
      ...formData,
      birthDate: new Date(formData.birthDate).toISOString(),
    };

    addDentist(payload);
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
    addBulkAddDentists(file);
  };

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Добавление врача</h2>
      <div className={styles.frame}>
        <div
          className={styles.image}
          onClick={() => fileInputRef.current.click()}
        >
          <img src={formData.avatar} alt="avatar" />
        </div>
        <form action="submit" className={styles.form} onSubmit={handleSubmit}>
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
              label="Специальность"
              type="text"
              value={formData.position}
              onChange={(e) => handleChange("position", e.target.value)}
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
            <BigButton>Добавить врача</BigButton>
          </div>
        </form>
      </div>
      <form action="submit" className={styles.mass_form}>
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
export default AddSpecialistPage;
