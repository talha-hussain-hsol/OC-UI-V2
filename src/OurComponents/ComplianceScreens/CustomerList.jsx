import React from "react";
import Header from "../Reusable Components/Header";
import { useTheme } from "../../contexts/themeContext";
import Table from "../Reusable Components/Tables/Table";
import { MdOutlineFileDownload } from "react-icons/md";
import { MdDashboardCustomize } from "react-icons/md";
import { LuSearch } from "react-icons/lu";
import Tooltip from "../Reusable Components/Tooltip";
import { FaPlus } from "react-icons/fa6";
import SideBar from "../Reusable Components/SideBar";


function CustomerList() {
  const { theme } = useTheme();
  console.log("theme", theme);

  const DocHeaders = [
    "domain name",
    "identity",
    "name",
    "created by",
    "type",
    "Origin",
    "created On",
    "Action",
  ];

  const docRows = [
    {
      domain: "Demo Fund",
      identity: "Awais Amad",
      name: "John Doe",
      created: "Test-2024",
      type: "Individual",
      origin: "Management",
      createdOn: "Sep 13,2024",
      actionText: "Sign & Submit",
    },
    {
      domain: "Demo Fund",
      identity: "Awais Amad",
      name: "John Doe",
      created: "Test-2024",
      type: "Individual",
      origin: "Customer",
      createdOn: "Sep 13,2024",
      actionText: "Sign & Submit",
    },
    {
      domain: "Demo Fund",
      identity: "Awais Amad",
      name: "John Doe",
      created: "Test-2024",
      type: "Corporate",
      origin: "Customer",
      createdOn: "Sep 13,2024",
      actionText: "Sign & Submit",
    },
    {
      domain: "Demo Fund",
      identity: "Awais Amad",
      name: "John Doe",
      created: "Test-2024",
      type: "Corporate",
      origin: "Customer",
      createdOn: "Sep 13,2024",
      actionText: "Sign & Submit",
    },
    {
      domain: "Demo Fund",
      identity: "Awais Amad",
      name: "John Doe",
      created: "Test-2024",
      type: "Individual",
      origin: "Customer",
      createdOn: "Sep 13,2024",
      actionText: "Sign & Submit",
    },
    {
      domain: "Demo Fund",
      identity: "Awais Amad",
      name: "John Doe",
      created: "Test-2024",
      type: "Corporate",
      origin: "Customer",
      createdOn: "Sep 13,2024",
      actionText: "Sign & Submit",
    },
    {
      domain: "Demo Fund",
      identity: "Awais Amad",
      name: "John Doe",
      created: "Test-2024",
      type: "Individual",
      origin: "Customer",
      createdOn: "Sep 13,2024",
      actionText: "Sign & Submit",
    },
    {
      domain: "Demo Fund",
      identity: "Awais Amad",
      name: "John Doe",
      created: "Test-2024",
      type: "Corporate",
      origin: "Customer",
      createdOn: "Sep 13,2024",
      actionText: "Sign & Submit",
    },
    {
      domain: "Demo Fund",
      identity: "Awais Amad",
      name: "John Doe",
      created: "Test-2024",
      type: "Individual",
      origin: "Customer",
      createdOn: "Sep 13,2024",
      actionText: "Sign & Submit",
    },
  ];

  return (
    <>
        <SideBar portalType="Compliance" />
      <div
        className={`bg-color-${theme} w-full px-4 py-4 sm:px-6 md:px-16 lg:px-24 md:py-5 lg:py-6 `}
      >

        <Header
          heading="Customer List"
          subheading="Compliance Portal"
          showLogo={true}
          className="items-center"
          showTabBar={false}
          theme={theme}
        />
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-10 sm:ml-8">
            <label className="flex items-center">
              <input
                type="radio"
                name="option"
                value="All"
                className="form-radio rounded-full text-blue-500"
              />
              <span className={`ml-2 text-color-text-${theme}`}>All</span>
            </label>

            <label className="flex items-center">
              <input
                type="radio"
                name="option"
                value="Individual"
                className="form-radio rounded-full text-blue-500"
              />
              <span className={`ml-2 text-color-text-${theme}`}>
                Individual
              </span>
            </label>

            <label className="flex items-center">
              <input
                type="radio"
                name="option"
                value="Corporate"
                className="form-radio rounded-full text-blue-500"
              />
              <span className={`ml-2 text-color-text-${theme}`}>Corporate</span>
            </label>
          </div>
          <div className={`flex items-center space-x-2 mt-4 sm:mt-0`}>
            <input
              type="text"
              id="search"
              placeholder="Label of Identity"
              className={`w-full bg-color-textfield-dropdown-${theme} py-2 px-4 rounded-md`}
            />
            <LuSearch color={`text-color-icon-${theme}`} size={20} />
          </div>
        </div>

        <div
          className={`bg-color-header-${theme} border border-color-${theme} rounded-lg mt-4`}
        >
          <Table
            headers={DocHeaders}
            headerClassName={`bg-color-table-header-${theme}`}
            rows={docRows}
            renderRow={(row) => (
              <>
                <td className="py-4 px-6 font-light uppercase">{row.domain}</td>

                <td className="py-4 px-6 font-light">
                  <Tooltip content={row.identity}>
                    {row.identity.length > 6
                      ? `${row.identity.slice(0, 6)}...`
                      : row.identity}
                  </Tooltip>
                </td>
                <td className="py-4 px-6 font-light" title={row.name}>
                  <Tooltip content={row.name}>
                    {row.name.length > 6
                      ? `${row.name.slice(0, 6)}...`
                      : row.name}
                  </Tooltip>
                </td>
                <td className="py-4 px-6 font-light">{row.created}</td>
                <td className="py-4 px-6 font-light">{row.type}</td>
                <td className="py-4 px-6 font-light">{row.origin}</td>
                <td className={`py-4 px-6 font-light`}>{row.createdOn}</td>
                <td className={`py-2 px-2 sm:py-4 sm:px-4 `}>
                  <div className="flex justify-start space-x-4 sm:space-x-6 text-base sm:text-lg">
                    <MdDashboardCustomize />
                    <FaPlus />
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

export default CustomerList;
