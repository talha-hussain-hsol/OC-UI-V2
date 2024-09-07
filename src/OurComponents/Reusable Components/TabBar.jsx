import React, { useState } from "react";
import { useTheme } from "../../contexts/themeContext";

const TabBar = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(0);
  const { theme } = useTheme();
  return (
    <div className="flex space-x-4">
      {tabs.map((tab, index) => (
        <button
          key={index}
          onClick={() => setActiveTab(index)}
          className={`text-color-h1-${theme} font-medium pt-2 pb-8 ml-6 ${
            activeTab === index ? "border-b-2 border-blue-500" : ""
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default TabBar;
