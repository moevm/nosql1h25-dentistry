import { forwardRef } from "react";

const BaseInputField = forwardRef(
  (
    {
      label,
      type,
      name,
      placeholder,
      value,
      onChange,
      required = true,
      className,
      labelClassName,
      inputClassName,
    },
    ref
  ) => (
    <label htmlFor={name} className={className}>
      <div className={labelClassName}>{label}</div>
      {type == "textarea" ? (
        <textarea
          name={name}
          id={name}
          placeholder={placeholder}
          required={required}
          className={inputClassName}
          value={value}
          onChange={onChange}
          ref={ref}
        />
      ) : (
        <input
          type={type}
          name={name}
          id={name}
          placeholder={placeholder}
          required={required}
          className={inputClassName}
          value={value}
          onChange={onChange}
          ref={ref}
        />
      )}
    </label>
  )
);

BaseInputField.displayName = "BaseInputField";

export default BaseInputField;
