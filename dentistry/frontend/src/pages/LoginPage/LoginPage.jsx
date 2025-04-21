import { Link } from "react-router-dom";
import AuthShell from "../../components/AuthShell";
import InputField from "../../components/InputField";
import AuthButton from "../../components/AuthButton";
import styles from "./LoginPage.module.css";

const LoginPage = () => (
  <AuthShell>
    <form action="#" className={styles.form}>
      <div className={styles.fields}>
        <InputField
          label="E-mail"
          type="email"
          name="email"
          placeholder="укажите e-mail"
        />
        <InputField
          label="Пароль"
          type="password"
          name="password"
          placeholder="введите пароль"
        />
        <div className={styles.input}>
          <label className={styles.checkbox_label}>
            <input
              type="checkbox"
              name="remember"
              className={styles.checkbox}
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
  </AuthShell>
);

export default LoginPage;
