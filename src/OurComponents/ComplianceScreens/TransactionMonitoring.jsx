import React, { useState } from "react";
import SideBar from "../Reusable Components/SideBar";
import { useTheme } from "../../contexts/themeContext";
import Header from "../Reusable Components/Header";
import Table from "../Reusable Components/Tables/Table";
import CardHeader from "../Reusable Components/CardComponent/CardHeader";
import { MdOutlineFileDownload } from "react-icons/md";
import { MdDashboardCustomize } from "react-icons/md";
import TransactionSummary from "../ComplianceScreens/TransactionSummary";
import AlertsTransaction from "../ComplianceScreens/AlertsTransaction";
import Transactions from "../ComplianceScreens/Transactions";
import UploadTransaction from "../ComplianceScreens/UploadTransaction";
import TabBar from "../Reusable Components/TabBar";

const TransactionMonitoring = () => {

    const { theme } = useTheme();
  console.log("theme", theme);
  const [selectedTab, setSelectedTab] = useState("Transaction Monitoring");
  const [tabIndex, setTabIndex] = useState(0); 


  const handleTabChange = (tab) => {
    setSelectedTab(tab); // Update the selected tab state
    setTabIndex(index);
  };
  const renderSelectedTabContent = () => {
    if (selectedTab === "Transactions" || tabIndex === 0) {
      return <UploadTransaction />;
    }
  };

    return (
        <>
          <SideBar portalType="Compliance" />
          <div
            className={`bg-color-${theme} w-full px-4 py-4 sm:px-6 md:px-16 lg:px-24 md:py-5 lg:py-6 `}
          >
            <Header
              heading="Demo Fund"
              subheading="Compliance Portal"
              showLogo={true}
              className="items-center"
              showTabBar={true}
              theme={theme}
            />
            <div
              className={`bg-color-card-${theme} rounded-md shadow-${theme} ml-4 sm:ml-6 flex flex-col items-center justify-center h-full w-full`}
            >
              <div
                className={`bg-color-card-${theme} flex justify-between w-full p-3`}
              >
                <h1 className={`text-color-text-${theme} mt-2 ml-2 sm:ml-4`}>
                  {selectedTab}
                </h1>
                <TabBar
                  className="mr-6 sm:mr-4"
                  tabs={["Summary","Transactions", "Alerts", "Upload"]}
                  onTabChange={(tab, index) => handleTabChange(tab, index)}
                />
              </div>
              <div className="w-full p-4">
                {renderSelectedTabContent()}
              </div>
              
            </div>
          </div>
        </>
      );
}

export default TransactionMonitoring