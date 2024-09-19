import React, { useState } from "react";
import { useTheme } from "../../../contexts/themeContext";
import TabBar from "../TabBar";
import Button from "../Button";
import Table from "../Tables/Table";
import { RiSearchLine } from "react-icons/ri";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { MdDeleteOutline } from "react-icons/md";
import { HiDownload, HiOutlineDotsVertical } from "react-icons/hi";
import { FaBars, FaPlus } from "react-icons/fa6";
import ExpiringDocuments from "./ExpiringDocuments";
import PeriodicReview from "./PeriodicReviewFundAccount";
import QuickScan from "./QuickScan";
import DueDilligenceScreen from "./DueDilligenceScreen";
import { TbListDetails } from "react-icons/tb";
import Tooltip from "../Tooltip";
import { ImDownload3 } from "react-icons/im";

const FundAccountCard = () => {
  const { theme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [actionMenuOpen, setActionMenuOpen] = useState(false);
  const [activeActionMenuIndex, setActiveActionMenuIndex] = useState(null);

  const toggleActionMenu = (index) => {
    if (activeActionMenuIndex === index) {
      setActiveActionMenuIndex(null);
    } else {
      setActiveActionMenuIndex(index);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  // const [activeTab, setActiveTab] = useState(0);
  // const handleTabChange = (index) => {
  //   console.log("Index",index)
  //   setActiveTab(index);
  // };

  const [selectedTab, setSelectedTab] = useState("Wallet");
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (tab, index) => {
    setSelectedTab(tab);
    setTabIndex(index);
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
    if (selectedTab === "" || tabIndex === 0) {
      return (
        <div>
          <div className={`rounded-b-xl w-full`}>
            <div
              className={`relative w-full py-2 px-4 bg-color-table-header-${theme}`}
            >
              <input
                type="text"
                placeholder="Search"
                className={`w-full py-2 px-4 pr-10 bg-color-search-${theme} text-sm rounded-lg outline-none text-color-profile-icon-${theme} `}
              />
              <RiSearchLine className="absolute text-[#748aa9] right-6 top-1/2 transform -translate-y-1/2 " />
            </div>
          </div>

          <Table
            headers={Headers}
            rows={Rows}
            headerClassName={`bg-color-table-bg-${theme}`}
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
                <td className="py-4 px-6 font-light text-xs flex items-center relative">
                  <Tooltip content="Identity Details" position="top">
                    <TbListDetails size={18} color="008000" />
                  </Tooltip>
                  <Tooltip content="Delete Account" position="top">
                    <MdDeleteOutline size={20} color="#d03354" />
                  </Tooltip>
                  <Tooltip content="Actions" position="top">
                    <HiOutlineDotsVertical
                      size={18}
                      color="#2c7be5"
                      onClick={() => toggleActionMenu(index)}
                    />
                  </Tooltip>
                </td>
              </>
            )}
          />
        </div>
      );
    } else if (selectedTab === "Documents Expiry" || tabIndex === 1) {
      return (
        <div>
          <ExpiringDocuments />
        </div>
      );
    } else if (selectedTab === "Periodic Review" || tabIndex === 2) {
      return (
        <div>
          <PeriodicReview />
        </div>
      );
    } else if (selectedTab === "Due Deligence" || tabIndex === 3) {
      return (
        <div>
          <DueDilligenceScreen />
        </div>
      );
    } else if (selectedTab === "Quick Scan" || tabIndex === 4) {
      return (
        <div>
          <QuickScan />
        </div>
      );
    }
  };

  return (
    <div className={`shadow-${theme} sm:ml-16  rounded-lg lg:ml-5`}>
      <div
        className={`flex w-full justify-between items-center bg-color-header-${theme} border border-color-${theme} rounded-t-xl px-6`}
      >
        {/* For large screens, display the TabBar */}
        <div className="hidden lg:flex">
          <TabBar
            tabs={[
              "Accounts",
              "Documents Expiry",
              "Periodic Review",
              "Due Diligence",
              "Quick Scan",
            ]}
            className="text-xs font-light ml-4 py-6 "
            onTabChange={(tab, index) => handleTabChange(tab, index)}
          />
        </div>

        {/* For small screens, display the hamburger menu */}
        <div className="lg:hidden flex items-center">
          <button
            onClick={toggleMenu}
            className={`text-color-profile-icon-${theme} text-sm px-2 py-2`}
          >
            <FaBars size={24} />
          </button>
        </div>

        {/* Dropdown menu when hamburger is clicked */}
        {isMenuOpen && (
          <div
            className={`lg:hidden absolute left-10 top-56 mt-2 shadow-lg rounded-md z-10 border border-color-${theme} bg-color-header-${theme} text-color-text-${theme} text-xs`}
          >
            <ul className="flex flex-col items-start">
              {[
                "Accounts",
                "Documents Expiry",
                "Periodic Review",
                "Due Diligence",
                "Quick Scan",
              ].map((tab, index) => (
                <li
                  key={index}
                  className="px-4 py-2 w-full hover:bg-gray-100"
                  onClick={() => {
                    handleTabChange(tab, index);
                    setIsMenuOpen(false);
                  }}
                >
                  {tab}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* <TabBar
          tabs={[
            "Accounts",
            "Documents Expiry",
            "Periodic Review",
            "Due Diligence",
            "Quick Scan",
          ]}
          className="text-xs font-light ml-4 py-6"
          // onTabChange={handleTabChange}
          onTabChange={(tab, index) => handleTabChange(tab, index)}
        /> */}
        <div className="flex md:gap-4 gap-1 ">
          <Button
            text="Create Account"
            icon={<FaPlus color="#008000" />}
            iconPosition="left"
            className={`text-color-profile-icon-${theme} sm:text-sm text-[6px] font-light border-color-button-${theme} border rounded-md px-2 py-2 hover:bg-color-tab-button1-hover-${theme} transition duration-300 ease-in-out hover:border-color-tab-button1-hover-${theme}`}
          ></Button>
          <Button
            text="Import Bulk Customer"
            icon={<FaPlus color="#008000" />}
            iconPosition="left"
            className={`text-color-profile-icon-${theme} sm:text-sm text-[6px] font-light border-color-button-${theme} border rounded-md px-2 py-2 hover:bg-color-tab-button1-hover-${theme} transition duration-300 ease-in-out hover:border-color-tab-button1-hover-${theme}`}
          ></Button>
          <Button
            text="Download Domain Report"
            icon={<HiDownload color="white" />}
            iconPosition="right"
            iconClassName="ml-1"
            className={`text-white sm:text-sm text-[6px] font-light bg-color-button-${theme} px-1 py-2 rounded-md hover:bg-color-tab-button2-hover-${theme} transition duration-300 ease-in-out`}
          ></Button>
        </div>
      </div>
      {renderContent()}
    </div>
  );
};

export default FundAccountCard;
