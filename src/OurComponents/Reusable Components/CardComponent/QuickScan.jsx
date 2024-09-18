import React, { useState } from "react";
import { useTheme } from "../../../contexts/themeContext";
import Button from "../Button";
import Table from "../Tables/Table";

const QuickScan = () => {
  const { theme } = useTheme();
  const [activeButton, setActiveButton] = useState("individual");
  const Headers = [
    "Name",
    "Customer Type",
    "Search Engines",
    "Created At",
    "Last Screened",
    "Status",
    "Action",
  ];

  const Rows = [
    {
      name: "Staging test",
      type: "Individual",
      searchEngines: "Utility/telephone bill",
      createdAt: "12/05/2023",
      lastScreened: "Sep 3, 2024, 12:14:06 PM, UTC",
      status: "Calculating...",
    },
    {
      name: "Staging test",
      type: "Individual",
      searchEngines: "Utility/telephone bill",
      createdAt: "12/05/2023",
      lastScreened: "Sep 3, 2024, 12:14:06 PM, UTC",
      status: "Calculating...",
    },
    {
      name: "Staging test",
      type: "Individual",
      searchEngines: "Utility/telephone bill",
      createdAt: "12/05/2023",
      lastScreened: "Sep 3, 2024, 12:14:06 PM, UTC",
      status: "Calculating...",
    },
  ];
  return (
    <>
      <div
        className={`bg-color-header-${theme} p-4 shadow-${theme} border border-color-${theme} rounded-b-lg mb-4 `}
      >
        <div
          className={`bg-color-header-${theme} m-2 p-10 border shadow-${theme} border-color-${theme} rounded-lg`}
        >
          <div className={`flex items-center justify-center `}>
            <Button
              text="Individual"
              onClick={() => setActiveButton("individual")}
              className={`${
                activeButton === "individual"
                  ? `bg-color-button-${theme} text-white border-color-button-border-${theme}`
                  : `bg-color-tab-buttons-inactive-${theme} text-color-profile-icon-${theme} border-color-button-border-${theme}`
              } py-5 px-4 rounded-l-full border border-blue-500`}
            />
            <Button
              text="Corporate"
              onClick={() => setActiveButton("corporate")}
              className={`${
                activeButton === "corporate"
                  ? `bg-color-button-${theme} text-white border-color-button-border-${theme}`
                  : `bg-color-tab-buttons-inactive-${theme} text-color-profile-icon-${theme} border-color-button-border-${theme}`
              } py-5 px-4 rounded-r-full border border-blue-500`}
            />
          </div>
          <p className={`text-xs text-center text-[#6b82a1] py-10`}>
            Quick Scan allows users to do an ad-hoc preliminary screening based
            on the name of an individual or a corporate.
            <br /> Users will have the flexibility to include global database
            coverage of Politically Exposed Persons (PEP), Sanctions and Adverse
            Media as part of the search criteria.
          </p>
          <div className={`sm:flex gap-2 justify-between items-center`}>
            <div className="flex flex-col gap-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="sanctionLists"
                  className={`h-4 w-4 rounded-full bg-color-textfield-dropdown-${theme}`}
                />
                <label
                  htmlFor="sanctionLists"
                  className={`ml-2 text-sm font-medium text-color-text-${theme}`}
                >
                  Sanction List
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="internalList"
                  className={`h-4 w-4 rounded-full bg-color-textfield-dropdown-${theme}`}
                />
                <label
                  htmlFor="internalList"
                  className={`ml-2 text-sm font-medium text-color-text-${theme}`}
                >
                  Internal List
                </label>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="adverseMedia"
                  className={`h-4 w-4 rounded-full bg-color-textfield-dropdown-${theme}`}
                />
                <label
                  htmlFor="adverseMedia"
                  className={`ml-2 text-sm font-medium text-color-text-${theme}`}
                >
                  Adverse Media News
                </label>
              </div>
            </div>
          </div>
          <div>
            <input
              type="text"
              id="search"
              placeholder="Search..."
              className={`w-full bg-color-textfield-dropdown-${theme} py-2 px-4 rounded-md my-4`}
            />
          </div>
          <Button
            text="Advance Filters"
            className={`text-white text-sm font-light bg-color-button-${theme} px-4 py-6 rounded-md ml-auto`}
          />
          <Button
            text="Quick Scan"
            className={`text-white text-sm font-light bg-color-button1-${theme} px-4 py-6 rounded-md mx-auto my-2`}
          />
        </div>
      </div>
      <div
        className={`bg-color-header-${theme}  shadow-${theme} rounded-lg pt-20 pb-10 border border-color-${theme}`}
      >
        <div className={`shadow-${theme} rounded-lg border border-color-${theme}`}>
          <Table
            headers={Headers}
            rows={Rows}
            headerClassName={`bg-color-table-bg-${theme}`}
            showField={true}
            className={`bg-color-header-${theme} rounded-b-lg `}
            renderRow={(row, index) => (
              <>
                <td className="py-4 px-6 font-light text-xs flex items-center gap-1">
                  {row.name}
                </td>
                <td className="py-4 px-6 font-light text-xs">{row.type}</td>
                <td className="py-4 px-6 font-light text-xs">
                  {row.searchEngines}
                </td>
                <td className="py-4 px-6 font-light text-xs">
                  {row.createdAt}
                </td>
                <td className="py-4 px-6 font-light text-xs">
                  {row.lastScreened}
                </td>
                <td className="py-4 px-6 font-light text-xs">{row.status}</td>
                <td className="py-4 px-6 font-light text-xs"></td>
              </>
            )}
          />
        </div>
      </div>
    </>
  );
};

export default QuickScan;
