import { forwardRef } from "react";
import styles from "./InputField.module.css";

const InputField = forwardRef(
  (
    { label, type, name, placeholder, value, onChange, required = true },
    ref
  ) => (
    <div className={styles.input}>
      <label htmlFor={name} className={styles.input_label}>
        {label}
      </label>
      <input
        type={type}
        name={name}
        id={name}
        placeholder={placeholder}
        required={required}
        className={styles.input_input}
        ref={ref}
        value={value}
        onChange={onChange}
      />
    </div>
  )
);

InputField.displayName = "InputField";

export default InputField;
