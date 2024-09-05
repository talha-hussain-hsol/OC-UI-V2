import React from 'react';
import { useTheme } from '../../contexts/themeContext';

const UserInfo = () => {
  const { theme } = useTheme();

  // Common input classes
  const inputClasses = 'p-2 border rounded-lg outline-none';

  return (
    <div className={`bg-color-card-${theme} flex flex-col gap-2 border rounded-lg p-4`}>
      <input
        className={`${inputClasses} bg-${theme}-bg-secondary text-${theme}-text border-${theme}-border-color`}
        type="text"
        placeholder="First Name"
      />
      <input
        className={`${inputClasses} bg-${theme}-bg-secondary text-${theme}-text border-${theme}-border-color`}
        type="text"
        placeholder="Last Name"
      />
      <button
        className={`text-color-${theme} border-color-${theme} hover:bg-color-${theme}-hover bg-gray-100 hover:text-gray-100 font-bold border p-2 rounded-lg`}
      >
        Save
      </button>
    </div>
  );
};

export default UserInfo;
