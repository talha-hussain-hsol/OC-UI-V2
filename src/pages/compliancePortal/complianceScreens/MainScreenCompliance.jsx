import React,{useState} from 'react'
import { useTheme } from '../../../contexts/themeContext';
import SideBar from '../../../components/sidebar/Sidebar';
import Header from '../../../components/header/Header';
import KYW from './KYW';
import ComplianceDashboard from './ComplianceDashboard';
import FundAccounts from './FundAccounts';
import TransactionMonitoring from './TransactionMonitoring';
import RestrictedLists from './RestrictedLists';
import DomainAccounts from './DomainAccounts';
// import Dashboard from '../../customerPortal/screen/dashboard';

function MainScreenCompliance() {
    const { theme } = useTheme();
    console.log("theme", theme);
    const [selectedTab, setSelectedTab] = useState("Dashboard");

  const handleTabChange = (tab) => {
    setSelectedTab(tab); 
  };

  const renderSelectedComponent = () => {
    switch (selectedTab) {
      case "Domain":
        return <DomainAccounts />;
      case "Dashboard":
        console.log("Dashboard");
        return <ComplianceDashboard />;
      case "KYC/KYB":
        console.log("KYC");
        return <FundAccounts />;
      case "KYW":
        console.log("KYW");
        return <KYW />;
      case "Transaction Monitoring":
        console.log("Transaction");
        return <TransactionMonitoring />;
      case "Restricted Lists":
        console.log("Restricted");
        return <RestrictedLists />;
      default:
        console.log("asdjsdkfnjkz");
        return <ComplianceDashboard />;
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
