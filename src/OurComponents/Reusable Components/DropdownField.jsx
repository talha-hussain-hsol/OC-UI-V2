// import React from 'react';

// const DropdownField = ({ id, name, required, options, value, onChange, label }) => {
//   return (
//     <select
//       id={id}
//       name={name}
//       required={required}
//       value={value}
//       onChange={onChange}
//       className={`bg-[#1e3a5c] p-2 pl-3 shadow-[0px_6px_20px_5px_rgba(0,0,0,0.4)] rounded-md text-white h-9 text-sm w-full border ${
//         required ? 'border-yellow-500' : 'border-gray-700'
//       } focus:outline-none focus:ring-2 focus:ring-blue-500`}
//       style={{ lineHeight: '1.5' }}
//     >
//       <option value="">{`Select ${label}`}</option>
//       {options}
//     </select>
//   );
// };

// export default DropdownField;

// import React from 'react';
// import { useTheme } from "../../contexts/themeContext";

// const DropdownField = ({ id, name, required, options, value, onChange, label }) => {
//   const { theme } = useTheme();  // Get the current theme

//   return (
//     <select
//       id={id}
//       name={name}
//       required={required}
//       value={value}
//       onChange={onChange}
//       className={`bg-color-dropdown-${theme} p-2 pl-3 shadow-[0px_6px_20px_5px_rgba(0,0,0,0.4)] rounded-md text-color-${theme} h-9 text-sm w-full border ${
//         theme === "theme1"
//           ? `bg-color-dropdown-${theme} text-green-500 focus:ring-color-theme1`
//           : `bg-[#1e3a5c] text-white focus:ring-color-theme2`
//       } ${
//         required ? `border-color-${theme}-hover` : `border-color-${theme}`
//       } focus:outline-none focus:ring-2 focus:ring-color-theme-${theme}`}
//       style={{ lineHeight: '1.5' }}
//     >
//       <option value="">{`Select ${label}`}</option>
//       {options}
//     </select>
//   );
// };

// export default DropdownField;


import React from 'react';
import { useTheme } from "../../contexts/themeContext";

const DropdownField = ({ id, name, required, options, value, onChange, label }) => {
  const { theme } = useTheme(); // Get the current theme

  return (
    <select
      id={id}
      name={name}
      required={required}
      value={value}
      onChange={onChange}
      className={`p-2 pl-3 shadow-[0px_6px_20px_5px_rgba(0,0,0,0.4)] rounded-md h-9 text-sm w-full border focus:outline-none focus:ring-2 ${
        theme === "theme1"
          ? `bg-color-dropdown-${theme} text-slate-500 focus:ring-color-theme1`
          : `bg-[#1e3a5c] text-white focus:ring-color-theme2`
      } ${
        required ? "border-yellow-500" : `border-[0]`
      }`}
      style={{ lineHeight: '1.5' }}
    >
      <option value="">{`Select ${label}`}</option>
      {options}
    </select>
  );
};

export default DropdownField;


