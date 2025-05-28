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
    first_name: "",
    last_name: "",
    username: "",
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
      first_name: formData.first_name,
      last_name: formData.last_name,
      username: formData.username,
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
            name="first_name"
            placeholder="введите имя"
            value={formData.first_name}
            onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
          />
          <InputField
            label="Фамилия"
            type="text"
            name="last_name"
            placeholder="введите фамилию"
            value={formData.last_name}
            onChange={(e) =>
              setFormData({ ...formData, last_name: e.target.value })
            }
          />
          <InputField
            label="Имя пользователя"
            type="text"
            name="username"
            placeholder="введите имя пользователя"
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
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
      {error && <div className={styles.error}>{error}</div>}
    </>
  );
};
export default RegisterPage;
