import { forwardRef } from "react";
import clsx from "clsx";
import styles from "./AddFormInputField.module.css";
import BaseInputField from "../BaseInputField";

const AddFormInputField = forwardRef((props, ref) => {
  props = {
    ...props,
    className: clsx(styles.field, props.className),
    labelClassName: clsx(styles.label, props.labelClassName),
    inputClassName: clsx(styles.input, props.inputClassName),
  };
  return <BaseInputField {...props} ref={ref} />;
});

AddFormInputField.displayName = "AddFormInputField";

export default AddFormInputField;
