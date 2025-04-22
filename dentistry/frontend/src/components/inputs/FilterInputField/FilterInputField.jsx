import { forwardRef } from "react";
import clsx from "clsx";
import styles from "./FilterInputField.module.css";
import BaseInputField from "../BaseInputField";

const FilterInputField = forwardRef((props, ref) => {
  props = {
    ...props,
    className: clsx(styles.input, props.className),
    labelClassName: clsx(styles.input_label, props.labelClassName),
    inputClassName: clsx(styles.input_input, props.inputClassName),
  };
  return <BaseInputField {...props} ref={ref}/>;
});

FilterInputField.displayName = "FilterInputField";

export default FilterInputField;
