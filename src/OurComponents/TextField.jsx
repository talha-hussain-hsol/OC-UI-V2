import React from 'react';

const TextField = ({ id, name, required, type, value, placeholder, onChange }) => {
  return (
    <input
      id={id}
      name={name}
      type={type}
      required={required}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      className={`bg-[#1e3a5c] p-3 rounded-md text-white shadow-[0px_6px_20px_5px_rgba(0,0,0,0.5)] h-9 text-sm w-full border ${
        required ? 'border-yellow-500' : 'border-gray-700'
      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
    />
  );
};

export default TextField;

