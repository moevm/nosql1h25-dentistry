import { forwardRef } from "react";
import styles from "./FilterInputField.module.css";

const FilterInputField = forwardRef(
  ({ label, type, name, placeholder }, ref) => (
    <label htmlFor={name} className={styles.input}>
      <span className={styles.input_label}>{label}</span>
      <input
        type={type}
        name={name}
        id={name}
        placeholder={placeholder}
        required
        className={styles.input_input}
        ref={ref}
      />
    </label>
  )
);

FilterInputField.displayName = "FilterInputField";

export default FilterInputField;
