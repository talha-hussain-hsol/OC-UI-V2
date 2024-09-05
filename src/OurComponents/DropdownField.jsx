import React from 'react';

const DropdownField = ({ id, name, required, options, value, onChange, label }) => {
  return (
    <select
      id={id}
      name={name}
      required={required}
      value={value}
      onChange={onChange}
      className={`bg-[#1e3a5c] p-2 pl-3 shadow-[0px_6px_20px_5px_rgba(0,0,0,0.4)] rounded-md text-white h-9 text-sm w-full border ${
        required ? 'border-yellow-500' : 'border-gray-700'
      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
      style={{ lineHeight: '1.5' }}
    >
      <option value="">{`Select ${label}`}</option>
      {options}
    </select>
  );
};

export default DropdownField;


