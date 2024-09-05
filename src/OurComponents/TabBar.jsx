import React, { useState } from 'react';

const TabBar = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="flex space-x-4">
      {tabs.map((tab, index) => (
        <button
          key={index}
          onClick={() => setActiveTab(index)}
          className={`text-white font-light pt-2 pb-8 ml-6 ${
            activeTab === index ? 'border-b-2 border-blue-500' : ''
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default TabBar;
