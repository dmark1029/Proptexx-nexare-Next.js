import React from "react";

const FormInput = ({
  className,
  name,
  placeholder,
  type,
  onChange,
  value,
  disabled,
}) => {
  return (
    <input
      className={className}
      name={name}
      placeholder={placeholder}
      type={type}
      onChange={onChange}
      value={value}
      disabled={disabled}
    />
  );
};

export default FormInput;
