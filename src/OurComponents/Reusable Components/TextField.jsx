// import React from "react";

// const TextField = ({
//   id,
//   name,
//   required,
//   type,
//   value,
//   placeholder,
//   onChange,
// }) => {
//   return (
//     <input
//       id={id}
//       name={name}
//       type={type}
//       required={required}
//       value={value}
//       placeholder={placeholder}
//       onChange={onChange}
//       className={`bg-[#1e3a5c] p-3 rounded-md text-white shadow-[0px_6px_20px_5px_rgba(0,0,0,0.5)] h-9 text-sm w-full border  ${
//         required ? "border-yellow-500" : "border-gray-700"
//       } focus:outline-none focus:ring-2 focus:ring-blue-500`}
//     />
//   );
// };

// export default TextField;

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
      className={`p-3 rounded-md shadow-${theme} bg-color-textfield-dropdown-${theme} h-9 text-sm w-full focus:outline-none focus:ring-2  ${
        required ? `border border-yellow-500` : `border-0`
      }`}
    />
  );
};

export default TextField;



// [#1e3a5c]