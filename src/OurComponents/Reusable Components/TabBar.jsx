// import React, {useState} from "react";
// import { useTheme } from "../../contexts/themeContext";

// const TabBar = ({ tabs, className, onTabChange }) => {
//   const { theme } = useTheme();
//   const [activeTab, setActiveTab] = useState(0);
//   const handleTabChange = (index) => {
//     setActiveTab(index);
//     if (onTabChange) {
//       onTabChange(index);
//     }
//   };
//   return (
//     <div className="flex space-x-6">
//       {tabs.map((tab, index) => (
//         <button
//           key={index}
//           onClick={() => handleTabChange(index)}
//           className={` ${
//             activeTab === index
//               ? `border-b-2 border-blue-500 text-color-${theme}`
//               : `text-[#748aa9] border-transparent hover:text-[#516989] transition-colors duration-200`
//           } ${className}`}
//         >
//           {tab}
//         </button>
//       ))}
//     </div>
//   );
// };

// export default TabBar;

// import React, { useState } from "react";
// import { useTheme } from "../../contexts/themeContext";

// const TabBar = ({ tabs, className, onTabChange }) => {
//   const { theme } = useTheme();
//   const [activeTab, setActiveTab] = useState(0);

//   const handleTabChange = (index) => {
//     setActiveTab(index);
//     if (onTabChange) {
//       onTabChange(tabs[index], index); // Pass both tab name and index
//     }
//   };

//   return (
//     <div className="flex space-x-6">
//       {tabs.map((tab, index) => (
//         <button
//           key={index}
//           onClick={() => handleTabClick(tab, index)}
//           className={` ${
//             activeTab === index
//               ? `border-b-2 border-blue-500 text-color-${theme}`
//               : `text-[#748aa9] border-transparent hover:text-[#516989] transition-colors duration-200`
//           } ${className}`}
//         >
//           {tab}
//         </button>
//       ))}
//     </div>
//   );
// };

// export default TabBar;

import React, { useState } from "react";
import { useTheme } from "../../contexts/themeContext";

const TabBar = ({ tabs, className, onTabChange }) => {
  const { theme } = useTheme();

  const [activeTab, setActiveTab] = useState(0);

  const handleTabClick = (tab, index) => {
    setActiveTab(index);

    if (onTabChange) {
      onTabChange(tab, index);
    }
  };

  return (
    <div className={`flex space-x-6`}>
      {tabs.map((tab, index) => (
        <button
          key={index}
          onClick={() => handleTabClick(tab, index)}
          className={` ${
            activeTab === index
              ? `border-b-2 border-blue-500 text-color-${theme}`
              : `text-[#748aa9] border-transparent hover:text-[#516989] transition-colors duration-200`
          } ${className}`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default TabBar;
