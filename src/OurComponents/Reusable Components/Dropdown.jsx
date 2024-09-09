import React from "react";
import { useTheme } from "../../contexts/themeContext";

const Dropdown = ({ label, options, onChange, value }) => {
  const { theme } = useTheme();
  return (
    <div
      className={`flex flex-col text-color-h1-${theme} sm:w-1/4 w-full z-0`}
    >
      <label className="mb-2">{label}</label>
      <select
        className={`bg-color-textfield-${theme} text-color-h1-${theme} p-2 shadow-[0px_6px_20px_rgba(0,0,0,0.9)] rounded-md border border-[#1c3758] appearance-none sm:text-base text-xs`}
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
