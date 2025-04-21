import AuthShell from "../../components/AuthShell";
import InputField from "../../components/InputField";
import AuthButton from "../../components/AuthButton";
import styles from "./RegisterPage.module.css";

const RegisterPage = () => (
  <AuthShell>
    <form action="#" className={styles.form}>
      <div className={styles.fields}>
        <InputField
          label="Имя"
          type="text"
          name="name"
          placeholder="введите имя"
        />
        <InputField
          label="Фамилия"
          type="text"
          name="surname"
          placeholder="введите фамилию"
        />
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
        <InputField
          label="Подтвердите пароль"
          type="password"
          name="confirmPassword"
          placeholder="подтвердите пароль"
        />
      </div>
      <AuthButton type={"submit"}>Регистрация </AuthButton>
    </form>
  </AuthShell>
);
export default RegisterPage;
