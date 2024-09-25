import React, { useState } from "react";
import { useTheme } from "../../../contexts/themeContext";
import TabBar from "../TabBar";
import Button from "../Button";
import Table from "../table/Table";
import { RiSearchLine } from "react-icons/ri";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { MdDeleteOutline } from "react-icons/md";
import { HiDownload, HiOutlineDotsVertical } from "react-icons/hi";
import { FaPlus } from "react-icons/fa6";

const FundAccountCard = () => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const handleTabChange = (index) => {
    setActiveTab(index);
  };
  const Headers = [
    "Account",
    "Type",
    "Customer Name",
    "Created By",
    "Submitted At",
    "Reviewed By",
    "Computed Risk Rating",
    "Override Risk Rating",
    "S/Status",
    "Status",
    "Action",
  ];

  const Rows = [
    {
      account: "Standalone",
      type: "Individual",
      name: "Customer Name",
      createdBy: "test-2024",
      submittedAt: "",
      reviewedBy: "",
      computedRiskRating: "",
      overrideRiskRating: "",
      sStatus: "Pending",
      status: "Pending",
      action: "",
    },
    {
      account: "Standalone",
      type: "Individual",
      name: "Customer Name",
      createdBy: "test-2024",
      submittedAt: "",
      reviewedBy: "",
      computedRiskRating: "",
      overrideRiskRating: "",
      sStatus: "Pending",
      status: "Pending",
      action: "",
    },
    {
      account: "Standalone",
      type: "Individual",
      name: "Customer Name",
      createdBy: "test-2024",
      submittedAt: "",
      reviewedBy: "",
      computedRiskRating: "",
      overrideRiskRating: "",
      sStatus: "Pending",
      status: "Pending",
      action: "",
    },
    {
      account: "Standalone",
      type: "Individual",
      name: "Customer Name",
      createdBy: "test-2024",
      submittedAt: "",
      reviewedBy: "",
      computedRiskRating: "",
      overrideRiskRating: "",
      sStatus: "Pending",
      status: "Pending",
      action: "",
    },
    {
      account: "Standalone",
      type: "Individual",
      name: "Customer Name",
      createdBy: "test-2024",
      submittedAt: "",
      reviewedBy: "",
      computedRiskRating: "",
      overrideRiskRating: "",
      sStatus: "Pending",
      status: "Pending",
      action: "",
    },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 0:
        return (
            <div>
                 <div className={`rounded-b-xl w-full`}>
        <div
          className={`relative w-full py-2 px-4 bg-color-table-header-${theme}`}
        >
          <input
            type="text"
            placeholder="Search"
            className="w-full py-2 px-4 pr-10 bg-[#1e3a5c] text-sm rounded-lg outline-none text-white transition-colors"
          />
          <RiSearchLine className="absolute text-[#748aa9] right-6 top-1/2 transform -translate-y-1/2 " />
        </div>
      </div>
            
          <Table
            headers={Headers}
            rows={Rows}
            headerClassName={`bg-color-table-header-${theme}`}
            showField={true}
            className={`bg-color-header-${theme} rounded-b-lg `}
            renderRow={(row, index) => (
              <>
                <td className="py-4 px-6 font-light text-xs flex items-center gap-1">
                  <IoMdCheckmarkCircleOutline
                    size={18}
                    className={`text-color-icon-${theme}`}
                  />
                  {row.account}
                </td>
                <td className="py-4 px-6 font-light text-xs">{row.type}</td>
                <td className="py-4 px-6 font-light text-xs">{row.name}</td>
                <td className="py-4 px-6 font-light text-xs">
                  {row.createdBy}
                </td>
                <td className="py-4 px-6 font-light text-xs">
                  {row.submittedAt}
                </td>
                <td className="py-4 px-6 font-light text-xs">
                  {row.reviewedBy}
                </td>
                <td className="py-4 px-6 font-light text-xs">
                  {row.computedRiskRating}
                </td>
                <td className="py-4 px-6 font-light text-xs">
                  {row.overrideRiskRating}
                </td>
                <td
                  className={`py-4 px-6 font-light text-xs text-color-icon-${theme}`}
                >
                  {row.sStatus}
                </td>
                <td
                  className={`py-4 px-6 font-light text-xs text-color-icon-${theme}`}
                >
                  {row.status}
                </td>
                <td className="py-4 px-6 font-light text-xs flex ">
                  <MdDeleteOutline size={20} color="#d03354" />
                  <HiOutlineDotsVertical size={18} color="#2c7be5" />
                </td>
              </>

            )}
          />
          </div>
        );
      case 1:
        return <div>Expiring Documents Content</div>;
      case 2:
        return <div>Periodic Review Content</div>;
      case 3:
        return <div>Due Diligence Content</div>;
      case 4:
        return <div>Quick Scan Content</div>;
      default:
        return null;
    }
  };

  return (
    <div className={`shadow-${theme} sm:ml-16 mr-10 rounded-lg`}>
      <div
        className={`flex w-full justify-between items-center bg-color-header-${theme} border border-color-${theme} rounded-t-xl px-6`}
      >
        <TabBar
          tabs={[
            "Accounts",
            "Documents Expiry",
            "Periodic Review",
            "Due Diligence",
            "Quick Scan",
          ]}
          className="text-xs font-light ml-4 py-6"
          onTabChange={handleTabChange}
        />
        <div className="flex gap-4">
          <Button
            text="Create Account"
            icon={<FaPlus color="#008000" />}
            iconPosition="left"
            className={`text-color-profile-icon-${theme} text-sm font-light border-color-button-${theme} border rounded-md px-2 py-2`}
          ></Button>
          <Button
            text="Import Bulk Customer"
            icon={<FaPlus color="#008000" />}
            iconPosition="left"
            className={`text-color-profile-icon-${theme} text-sm font-light border-color-button-${theme} border rounded-md px-2 py-2`}
          ></Button>
          <Button
            text="Download Domain Report"
            icon={<HiDownload color="white" />}
            iconPosition="right"
            iconClassName="ml-1"
            className={`text-white text-sm font-light bg-color-button-${theme} px-1 py-2 rounded-md `}
          ></Button>
        </div>
      </div>
      {renderContent()}
     
    </div>
  );
};

export default FundAccountCard;
