import React from "react";
import { useTheme } from "../../../contexts/themeContext";

const TextField = ({
  id,
  name,
  required,
  type,
  value,
  placeholder,
  onChange,
}) => {
  const { theme } = useTheme(); 

  return (
    <input
      id={id}
      name={name}
      type={type}
      required={required}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      className={`p-3 rounded-md shadow-${theme} bg-color-textfield-dropdown-${theme} h-9 text-sm w-full focus:outline-none focus:ring-2  ${
        required ? `border border-yellow-500` : `border-0`
      }`}
    />
  );
};

export default TextField;



