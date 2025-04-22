import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "../../components/inputs/InputField";
import AuthButton from "../../components/AuthButton";
import styles from "./RegisterPage.module.css";
import { useRegister } from "../../hooks/authHooks";

const RegisterPage = () => {
  const { register, loading, error, success } = useRegister();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (success) {
      // Redirect to the main page or show a success message
      navigate("/");
      console.log("Registration successful");
    }
  }, [success]);

  const handleSubmit = async (e) => {
    if (loading) return;
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Пароли не совпадают");
      return;
    }

    const payload = {
      name: formData.name,
      surname: formData.surname,
      email: formData.email,
      password: formData.password,
    };

    register(payload);
  };

  return (
    <>
      <form action="#" className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.fields}>
          <InputField
            label="Имя"
            type="text"
            name="name"
            placeholder="введите имя"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <InputField
            label="Фамилия"
            type="text"
            name="surname"
            placeholder="введите фамилию"
            value={formData.surname}
            onChange={(e) =>
              setFormData({ ...formData, surname: e.target.value })
            }
          />
          <InputField
            label="E-mail"
            type="email"
            name="email"
            placeholder="укажите e-mail"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
          <InputField
            label="Пароль"
            type="password"
            name="password"
            placeholder="введите пароль"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
          <InputField
            label="Подтвердите пароль"
            type="password"
            name="confirmPassword"
            placeholder="подтвердите пароль"
            value={formData.confirmPassword}
            onChange={(e) =>
              setFormData({ ...formData, confirmPassword: e.target.value })
            }
          />
        </div>
        <AuthButton type={"submit"}>Регистрация </AuthButton>
      </form>
    </>
  );
};
export default RegisterPage;
