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

  const { login, loading, error, success } = useLogin();

  useEffect(() => {
    if (success) {
      // Redirect to the main page or show a success message
      navigate("/");
      console.log("Login successful");
    }
  }, [success]);

  const handleSubmit = async (e) => {
    if (loading) return;
    e.preventDefault();
    login(formData);
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
