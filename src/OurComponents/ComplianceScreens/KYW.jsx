import React,{useState} from "react";
import SideBar from "../Reusable Components/SideBar";
import { useTheme } from "../../contexts/themeContext";
import Header from "../Reusable Components/Header";
import Table from "../Reusable Components/Tables/Table";
import CardHeader from "../Reusable Components/CardComponent/CardHeader";
import { MdOutlineFileDownload } from "react-icons/md";
import { MdDashboardCustomize } from "react-icons/md";
import TabBar from "../Reusable Components/TabBar";



function KYW() {
  const { theme } = useTheme();
  console.log("theme", theme);
  const [selectedTab, setSelectedTab] = useState("Wallet");

  const handleTabChange = (tab) => {
    setSelectedTab(tab); 
  };
  
  const DocHeaders = ["Account", "Stage", "Type", "Chain", "Address","Identity","Status","Action"];

  const docRows = [
    {
      account: 'Demo Fund 1',
      stage: 'Pending',
      type: 'Individual',
      chain: 'ADA',
      address: 'United States',
      identity: 'John Doe',
      status:'Draft',
      actionText: "Sign & Submit",
    },
    {
      account: 'Demo Fund 2',
      stage: 'Pending',
      type: 'Individual',
      chain: 'ADA',
      address: 'Singapore',
      identity:'John Doe',
      status:'Draft',
      actionText: "Sign & Submit",
    },
    {
      account: 'Demo Fund 3',
      stage: 'Pending',
      type: 'Individual',
      chain: 'ADA',
      address: 'Pakistan',
      identity:'John Doe',
      status:'Draft',
      actionText: "Sign & Submit",
    },{
      account: 'Demo Fund 4',
      stage: 'Pending',
      type: 'Individual',
      chain: 'ADA',
      address: 'Pakistan',
      identity:'John Doe',
      status:'Draft',
      actionText: "Sign & Submit",
    },{
      account: 'Demo Fund 5',
      stage:'Pending',
      type: 'Corporate',
      chain: 'ADA',
      address: 'Pakistan',
      identity:'John Doe',
      status:'Draft',
      actionText: "Sign & Submit",
    },{
      account: 'Demo Fund 6',
      stage: 'Pending',
      type: 'Individual',
      chain: 'ADA',
      address: 'Pakistan',
      identity:'John Doe',
      status:'Draft',
      actionText: "Sign & Submit",
    },{
      account: 'Demo Fund 7',
      stage:'Pending',
      type: 'Individual',
      chain: 'ADA',
      address: 'United States',
      identity:'John Doe',
      status:'Draft',
      actionText: "Sign & Submit",
    },{
      account: 'Demo Fund 8',
      stage:'Pending',
      type: 'Corporate',
      chain: 'ADA',
      address: 'Pakistan',
      identity:'John Doe',
      status:'Draft',
      actionText: "Sign & Submit",
    },{
      account: 'Demo Fund 1',
      stage:'Pending',
      type: 'Individual',
      chain: 'ADA',
      address: 'United States',
      identity:'John Doe',
      status:'Draft',
      actionText: "Sign & Submit",
    }
  ];
  return (
    <>
      <SideBar portalType="Compliance" />
      <div
  className={`bg-color-${theme} w-full px-4 py-4 sm:px-6 md:px-16 lg:px-24 md:py-5 lg:py-6 `}
>
  <div
    className={`bg-color-card-${theme} rounded-md shadow-${theme} ml-4 sm:ml-6 flex flex-col items-center justify-center h-full w-full`}
  >
    <div className={`bg-color-card-${theme} flex justify-between w-full`}>
      <h1 className={`text-color-text-${theme} mt-4 ml-2 sm:ml-4`}>
        {selectedTab}
      </h1>
      <TabBar
        className="mr-2 sm:mr-4"
        tabs={["Wallet", "Periodic Review", "Quick Scan"]}
        onTabChange={handleTabChange}
      />
    </div>
    <Table
      headers={DocHeaders}
      rows={docRows}
      renderRow={(row) => (
        <>
          <td className="py-2 px-2 sm:py-4 sm:px-4 uppercase">
            {row.account}
          </td>
          <td className="py-2 px-2 sm:py-4 sm:px-4">{row.stage}</td>
          <td className="py-2 px-2 sm:py-4 sm:px-4">{row.type}</td>
          <td className="py-2 px-2 sm:py-4 sm:px-4">{row.chain}</td>
          <td className="py-2 px-2 sm:py-4 sm:px-4">{row.address}</td>
          <td className="py-2 px-2 sm:py-4 sm:px-4">{row.identity}</td>
          <td className="py-2 px-2 sm:py-4 sm:px-4">{row.status}</td>
          <td className={`py-2 px-2 sm:py-4 sm:px-4 text-color-icon-${theme}`}>
            <div className="flex justify-start space-x-4 sm:space-x-6 text-base sm:text-lg">
              <MdDashboardCustomize />
              <MdOutlineFileDownload />
            </div>
          </td>
        </>
      )}
    />
  </div>
</div>

    </>
  );
}

export default KYW;
