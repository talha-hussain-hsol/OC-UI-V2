

import React from "react";
import { useTheme } from "../../contexts/themeContext";

const TextField = ({
  id,
  name,
  required,
  type,
  value,
  placeholder,
  onChange,
}) => {
  const { theme } = useTheme(); // Get the current theme

  return (
    <input
      id={id}
      name={name}
      type={type}
      required={required}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      className={`p-3 rounded-md  h-10 mt-2 text-sm w-full focus:outline-none focus:ring-2 bg-color-textfield-dropdown-${theme} ${
        required ? `border border-yellow-500` : `border-0`
      }`}
    />
  );
};

export default TextField;



// [#1e3a5c]