import React, { useState, useEffect } from "react";
import Table from "../../../../components/table/Table";
import Header from "../../../../components/header/Header";
import Button from "../../../../components/ui/button/Button";
import SideBar from "../../../../components/sidebar/Sidebar";
import { AiFillEdit } from "react-icons/ai";
import TabBar from "../../../../components/tabBar/TabBar";
import { useTheme } from "../../../../contexts/themeContext";
import { useNavigate } from "react-router-dom";
import useIdentityHook from "../../../../hooks/useIdentityHook";
import Loader from "../../../../components/ui/loader";

const Identities = () => {
  const [profileListData, setProfileListData] = useState([]);
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { entites, activePortal, portals, handleActivePortal, isLoader, fetchIdentities } = useIdentityHook(setProfileListData); // Pass state setter function

  // Fetch identity list on mount
  useEffect(() => {
    fetchIdentities(); 
  }, []);

  // Change theme based on user's choice
  useEffect(() => {
    document.body.style.backgroundColor =
      theme === "SC" ? "#ffffff" :
      theme === "Ascent" ? "rgba(18, 38, 63)" :
      theme === "lightTheme" ? "#000000" : "";

    return () => {
      document.body.style.backgroundColor = "";
    };
  }, [theme]);

  const handleClick = () => {
    navigate("/stepper");
  };

  const handleToggle = () => {
    console.log("Toggle Button Clicked!");
    
  }

  const headers = ["Name", "Type", "Status", "Actions"];
  
  // Manage toggle status for rows
  const [status, setStatus] = useState(profileListData.map(row => row.status === "Active"));
  const handleToggleStatus = (index) => {
    setStatus((prevStatus) => prevStatus.map((stat, i) => (i === index ? !stat : stat)));
  };

  return (
    <div className={`bg-color-${theme}`}>
      <SideBar portalType="Customer" />
      <div className="py-6 sm:ml-12 mx-4 sm:px-10 ">
        <Header heading="My Identities" subheading="Overview" showButton={false} theme={theme} />
        <div className="flex items-center justify-between">
          <TabBar tabs={["My Identities"]} className={`text-color-h1-${theme} font-medium ml-6 pt-8 pb-8`} />
          <Button
            className={`bg-color-button-${theme} text-white font-light rounded-lg py-6 px-8 text-sm sm:text-md`}
            text="Create New Identity"
            onClick={handleClick}
          />
        </div>
        <hr className="border-t-[1px] border-t-[#6e84a3] opacity-20 mb-6 ml-6" />
        <div className="flex flex-col w-full items-center justify-center sm:ml-6">
          <div className={`bg-color-card-${theme} shadow-${theme} rounded-md w-full`}>
          <div
            className={`bg-color-card-${theme} rounded-t-md border-color-${theme} border-b-[1px] shadow-${theme} flex flex-col items-center justify-center h-full w-full`}
          >
            <p
              className={`py-2 text-color-para-${theme} sm:text-xs text-[8px] w-full px-4`}
            >
              Please note that you can set your identities to "Inactive" or
              "Active" by using the toggle button. Your submitted account
              applications will not be impacted if you set your identities as
              "Inactive" <br />
              To delete/withdraw an account application, please proceed to the
              Account Details page to perform this action. <br />
              Please note that you can only delete/withdraw an application which
              are in "Draft" or "Pending" statuses. Applications that have
              already been processed for KYC screening cannot be deleted or
              withdrawn. <br />
              You may contact your Account Manager to assist you in this case.
            </p>
          </div>
            {isLoader ? (
              <Loader theme={theme} />
            ) : (
              <Table
                headers={headers}
                rows={profileListData}
                headerClassName={`bg-color-table-color-${theme}`}
                renderRow={(row, index) => (
                  <>
                    <td className="py-4 px-6 font-light">{row.label}</td>
                    <td className="py-4 px-6 font-light">{row.type}</td>
                    <td className={`py-4 px-6 text-color-status-${theme} font-light`}>
                      {status[index] ? "Active" : "Inactive"}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-4">
                        <AiFillEdit className={`text-color-h1-${theme} cursor-pointer hover:text-[#ee9d0b]`} />
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={status[index]}
                            onChange={() => handleToggle(index)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2c7be5]"></div>
                        </label>
                        <p className="font-light">Active</p>
                      </div>
                    </td>
                  </>
                )}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Identities;
