import React, { useState, useEffect, useCallback } from "react";
import Table from "../../../../components/table/Table";
import Header from "../../../../components/header/Header";
import Button from "../../../../components/ui/button/Button";
import SideBar from "../../../../components/sidebar/Sidebar";
import { AiFillEdit } from "react-icons/ai";
import TabBar from "../../../../components/tabBar/TabBar";
import { useTheme } from "../../../../contexts/themeContext";
import { useNavigate } from "react-router-dom";
import useIdentityHook from "../../../../hooks/useIdentityHook";
import axios from "axios";
import { getIdentityList } from "../../../../api/userApi";
import Loader from "../../../../components/ui/loader";

const Identities = () => {
  const [profileListData, setProfileListData] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false); // New state to track if data is loaded
  const cancelTokenSource = axios.CancelToken.source();
  const [activeStep, setActiveStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { entites, activePortal, portals, handleActivePortal, isLoader } =
    useIdentityHook();

  const handleGetIdentityList = useCallback(async () => {
    if (!isDataLoaded) {
      // Only fetch data if not already loaded
      setIsLoading(true);
      try {
        const response = await getIdentityList(cancelTokenSource.token);
        if (response.success) {
          setProfileListData(response.data);
          setIsDataLoaded(true); // Mark data as loaded after successful fetch
        }
      } catch (error) {
        console.error("Error fetching identity list:", error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [isDataLoaded]); // Depend on isDataLoaded to prevent refetching

  useEffect(() => {
    handleGetIdentityList(); // Trigger the API call
  }, [handleGetIdentityList]);

  const { theme } = useTheme();
  const navigate = useNavigate();

  function handleClick() {
    navigate("/stepper");
  }

  useEffect(() => {
    document.body.style.backgroundColor =
      theme === "SC"
        ? "#ffffff"
        : theme === "Ascent"
        ? "rgba(18, 38, 63)"
        : theme === "lightTheme"
        ? "#000000"
        : "";

    return () => {
      document.body.style.backgroundColor = "";
    };
  }, [theme]);

  const Headers = ["Name", "Type", "Status", "Actions"];
  const [status, setStatus] = useState(
    profileListData.map((row) => row.status === "Active")
  );
  const handleToggle = (index) => {
    setStatus((prevStatus) =>
      prevStatus.map((stat, i) => (i === index ? !stat : stat))
    );
  };

  return (
    <div className={`bg-color-${theme}`}>
      <SideBar portalType="Customer" />
      <div className="py-6 lg:ml-12 ml-4 lg:px-10 ">
        <div className="w-full">
          <Header
            heading="My Identities"
            subheading="Overview"
            showButton={false}
            theme={theme}
          />
          <div className="flex items-center justify-between lg:mr-0 mr-6">
            <TabBar
              tabs={["My Identities"]}
              className={`text-color-h1-${theme} font-medium sm:ml-6 pt-8 pb-8`}
            />
            <Button
              className={`bg-color-button-${theme} text-white font-light rounded-lg py-6 px-8 text-sm sm:text-md`}
              text="Create New Identity"
              onClick={handleClick}
            />
          </div>
          <hr className="border-t-[1px] border-t-[#6e84a3] opacity-20 mb-6 ml-6 lg:mr-0 mr-6" />
        </div>
        <div className="flex flex-col  items-center justify-center sm:ml-6 lg:mr-0 mr-6">
          <div
            className={`bg-color-card-${theme} rounded-t-md border-color-${theme} border-b-[1px] shadow-${theme} flex flex-col items-center justify-center h-full w-full `}
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
          <div
            className={`bg-color-card-${theme} shadow-${theme} rounded-b-md border-color-${theme} border-[1px] w-full`}
          >
            {isLoader ? (
              <Loader theme={theme} />
            ) : (
              <Table
                headers={Headers}
                rows={profileListData}
                headerClassName={`bg-color-table-color-${theme}`}
                renderRow={(row, index) => (
                  <>
                    <td className="py-4 px-6 font-light">{row.label}</td>
                    <td className="py-4 px-6 font-light">{row.type}</td>
                    <td
                      className={`py-4 px-6 text-color-status-${theme} font-light`}
                    >
                      {status[index] ? "Active" : "Inactive"}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-4">
                        <AiFillEdit
                          className={`text-color-h1-${theme} cursor-pointer hover:text-[#ee9d0b] transition-colors duration-200`}
                        />
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
