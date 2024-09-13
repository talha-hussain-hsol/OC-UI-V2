import React,{useState} from 'react'
import { useTheme } from '../../contexts/themeContext';
import SideBar from '../Reusable Components/SideBar';
import Header from '../Reusable Components/Header';
import KYW from './KYW';
import ComplianceDashboard from './ComplianceDashboard';
import FundAccounts from './FundAccounts';

function MainScreenCompliance() {
    const { theme } = useTheme();
    console.log("theme", theme);
    const [selectedTab, setSelectedTab] = useState("Dashboard");

  const handleTabChange = (tab) => {
    setSelectedTab(tab); 
  };

  const renderSelectedComponent = () => {
    switch (selectedTab) {
      case "Dashboard":
        return <ComplianceDashboard />;
      case "KYC/KYB":
        return <FundAccounts />;
      case "KYW":
        return <KYW />;
      case "Transaction Monitoring":
        return <TransactionMonitoring />;
      case "Restricted Lists":
        return <RestrictedLists />;
      default:
        return <Dashboard />;
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
          onTabChange={handleTabChange} 

          />

    <div className="">
        {renderSelectedComponent()} 
      </div>
    </div>
    </>
  )
}

export default MainScreenCompliance
