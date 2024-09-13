import React, { useState } from "react";
import SideBar from "../Reusable Components/SideBar";
import { useTheme } from "../../contexts/themeContext";
import Header from "../Reusable Components/Header";
import TabBar from "../Reusable Components/TabBar";
import Wallet from "../Reusable Components/Wallet";
import PeriodicReview from "../Reusable Components/PeriodicReview";
import QuickScan from "../Reusable Components/QuickScan";

function KYW() {
  const { theme } = useTheme();
  console.log("theme", theme);
  const [selectedTab, setSelectedTab] = useState("Wallet");
  const [tabIndex, setTabIndex] = useState(0); 

  const handleTabChange = (tab, index) => {
    setSelectedTab(tab); // Update the selected tab state
    setTabIndex(index);
  };

  const renderSelectedTabContent = () => {
    if (selectedTab === "Wallet" || tabIndex === 0) {
      return <Wallet />;
    } else if (selectedTab === "Periodic Review" || tabIndex === 1) {
      return <PeriodicReview />;
    } else if (selectedTab === "Quick Scan" || tabIndex === 2) {
      return <QuickScan />;
    }
  };

  return (
    <>
      
        <div
          className={`bg-color-card-${theme} rounded-md shadow-${theme} ml-4 sm:ml-6 flex flex-col items-center justify-center h-full w-full`}
        >
          <div
            className={`bg-color-header-${theme} border border-color-${theme} flex justify-between w-full p-3 rounded-lg`}  
          >
            <h1 className={`text-color-text-${theme} mt-2 ml-2 sm:ml-4`}>
              {selectedTab}
            </h1>
            <TabBar
              className="mr-6 sm:mr-4"
              tabs={["Wallet", "Periodic Review", "Quick Scan"]}
              onTabChange={(tab, index) => handleTabChange(tab, index)}
            />
          </div>

          <div className={`w-full  bg-color-header-${theme}`}>
            {renderSelectedTabContent()}
          </div>

          {selectedTab === "Quick Scan" && (
            <div className={`bg-color-header-${theme} border border-color-${theme} rounded-lg shadow-${theme} mt-8 w-full`}>  
              <h2 className={`text-color-text-${theme} mt-4 text-xl ml-2 mb-4`}>Report List</h2>
              <PeriodicReview />
            </div>
          )}
        </div>
    </>
  );
}

export default KYW;
