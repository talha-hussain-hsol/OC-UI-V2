import React from "react";
import { useTheme } from "../../../contexts/themeContext";

const Dropdown = ({ label, options, onChange, value, className }) => {
  const { theme } = useTheme();
  return (
    <div className={`${className}`}>
      <label className="mb-2">{label}</label>
      <select
        className={`bg-color-textfield-dropdown-${theme} text-color-h1-${theme} p-2 py-1.5  rounded-md  appearance-none sm:text-base text-xs`}
        value={value}
        onChange={onChange}
        style={{ maxWidth: "100%", width: "100%" }}
      >
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;
