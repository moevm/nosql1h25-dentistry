import BaseShell from "../../components/BaseShell";
import InputField from "../../components/inputs/InputField";
import AuthButton from "../../components/AuthButton";
import styles from "./ChangePasswordPage.module.css";

const ChangePasswordPage = () => (
  <BaseShell>
    <form action="#" className={styles.form}>
      <div className={styles.fields}>
        <InputField
          label="Старый пароль"
          type="text"
          name="oldPassword"
          placeholder="введите старый пароль"
        />
        <InputField
          label="Новый пароль"
          type="password"
          name="password"
          placeholder="введите новый пароль"
        />
        <InputField
          label="Подтвердите пароль"
          type="password"
          name="confirmPassword"
          placeholder="введите новый пароль"
        />
      </div>
      <AuthButton type={"submit"}>Изменить пароль</AuthButton>
    </form>
  </BaseShell>
);

export default ChangePasswordPage;
