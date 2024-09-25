

import React from "react";
import { useTheme } from "../../../contexts/themeContext";

const DropdownField = ({
  id,
  name,
  required,
  options,
  value,
  onChange,
  label,
}) => {
  const { theme } = useTheme(); 

  return (
    <select
      id={id}
      name={name}
      required={required}
      value={value}
      onChange={onChange}
      className={`p-2 pl-3 shadow-[0px_6px_20px_5px_rgba(0,0,0,0.4)] rounded-md h-9 text-sm w-full border focus:outline-none focus:ring-2 ${
        theme === "SC"
          ? `bg-color-dropdown-${theme} text-slate-500 focus:ring-color-SC`
          : `bg-[#1e3a5c] text-white focus:ring-color-theme2`
      } ${required ? "border-yellow-500" : `border-[0]`}`}
      style={{ lineHeight: "1.5" }}
    >
      <option value="">{`Select ${label}`}</option>
      {options}
    </select>
  );
};

export default DropdownField;
