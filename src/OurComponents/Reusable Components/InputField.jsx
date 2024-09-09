// InputField.jsx
// import React from 'react';

// const InputField = ({ placeholder, value, onChange }) => {
//   return (
//     <input
//       type="text"
//       placeholder={placeholder}
//       value={value}
//       onChange={onChange}
//       className="bg-[#1e3a5c] p-3 rounded-md text-white h-11 w-full border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
//     />
//   );
// };

// export default InputField;

import React from 'react';
import { useTheme } from "../../contexts/themeContext";

const InputField = ({ placeholder, value, onChange }) => {
  const { theme } = useTheme();  // Get the current theme

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



// "account_fields" :

// "corporate.basic.date_of_appointment": {
//                 "for": "crp",
//                 "type": "date",
//                 "index": 10,
//                 "label": "Date Of Appointment",
//                 "enabled": true,
//                 "required": false
            
//         },


        
// "corporate.basic.date_signed": {
//   "for": "crp",
//   "type": "date",
//   "index": 11,
//   "label": "Date Signed",
//   "enabled": true,
//   "required": false

// },
