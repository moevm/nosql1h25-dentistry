import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import InputField from "../../components/inputs/InputField";
import AuthButton from "../../components/AuthButton";
import styles from "./LoginPage.module.css";
import { useLogin } from "../../hooks/authHooks";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [remember, setRemember] = useState(false);
  const navigate = useNavigate();

  const { login, loading, error, success, authToken, user } = useLogin(); // Ваш хук для логина

  useEffect(() => {
    if (success && authToken && user) {
      console.log("Login successful", { authToken, user }); // Логируем успешный логин
      // Сохраняем данные в localStorage, если они есть
      if (remember) {
        localStorage.setItem("authToken", authToken);
        localStorage.setItem("user", JSON.stringify(user)); // Сохраняем пользователя в localStorage
      }
      // Редирект на главную страницу после успешного логина
      navigate("/");
    } else if (error) {
      console.error("Login failed", error); // Логируем ошибку
    }
  }, [success, authToken, user, remember, error, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) {
      console.log("Loading..."); // Логируем, если идет загрузка
      return;
    }
    console.log("Logging in with", formData); // Логируем данные, которые отправляются на сервер
    login(formData); // вызываем метод логина
  };

  return (
    <>
      <form action="#" className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.fields}>
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
          <div className={styles.input}>
            <label className={styles.checkbox_label}>
              <input
                type="checkbox"
                name="remember"
                className={styles.checkbox}
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />{" "}
              Запомнить меня
            </label>
          </div>
        </div>
        <AuthButton type={"submit"}>Войти</AuthButton>
      </form>
      <Link to="/forgot-password" className={styles.forgot_password}>
        Забыли пароль?
      </Link>
      {error && <div className={styles.error}>{error}</div>}
    </>
  );
};

export default LoginPage;
