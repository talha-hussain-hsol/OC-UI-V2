import React from "react";
import { useTheme } from "../../../contexts/themeContext";

const InputField = ({ placeholder, value, onChange }) => {
  const { theme } = useTheme();

  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`bg-white p-3 rounded-md text-green-500 text-color-${theme} h-11 w-full border border-color-${theme} focus:outline-none focus:ring-2 focus:ring-color-theme-${theme}`}
    />
  );
};

export default InputField;
