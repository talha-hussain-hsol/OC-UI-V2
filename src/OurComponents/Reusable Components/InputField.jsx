// InputField.jsx
import React from 'react';

const InputField = ({ placeholder, value, onChange }) => {
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="bg-[#1e3a5c] p-3 rounded-md text-white h-11 w-full border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
