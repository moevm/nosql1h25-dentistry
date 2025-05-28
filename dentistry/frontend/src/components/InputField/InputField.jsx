import { forwardRef } from "react";
import styles from "./InputField.module.css";

const InputField = forwardRef(({ label, type, name, placeholder }, ref) => (
  <div className={styles.input}>
    <label htmlFor={name} className={styles.input_label}>
      {label}
    </label>
    <input
      type={type}
      name={name}
      id={name}
      placeholder={placeholder}
      required
      className={styles.input_input}
      ref={ref}
    />
  </div>
));

InputField.displayName = "InputField";

export default InputField;
