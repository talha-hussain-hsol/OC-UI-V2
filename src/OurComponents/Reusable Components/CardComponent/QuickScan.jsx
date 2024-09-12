import React, { useState } from "react";
import { useTheme } from "../../../contexts/themeContext";
import Button from "../Button";

const QuickScan = () => {
  const { theme } = useTheme();
  const [activeButton, setActiveButton] = useState("individual");
  return (
    <>
    <div className={`bg-color-header-${theme} p-4`}>
      <div
        className={`bg-color-header-${theme} m-2 p-10 border shadow-${theme} border-color-${theme} rounded-lg`}
      >
        <div className={`flex items-center justify-center `}>
          <Button
            text="Individual"
            onClick={() => setActiveButton("individual")}
            className={`${
              activeButton === "individual"
                ? "bg-[#2c7be5] text-white border-[#2c7be5]"
                : "bg-[#0d3e80] text-white border-[#2c7be5]"
            } py-5 px-4 rounded-l-full border border-blue-500`}
          />
          <Button
            text="Corporate"
            onClick={() => setActiveButton("corporate")}
            className={`${
              activeButton === "corporate"
                ? "bg-[#2c7be5] text-white border-[#2c7be5]"
                : "bg-[#0d3e80] text-white border-[#2c7be5]"
            } py-5 px-4 rounded-r-full border border-blue-500`}
          />
        </div>
        <p className={`text-xs text-center text-[#6b82a1] py-10`}>
          Quick Scan allows users to do an ad-hoc preliminary screening based on
          the name of an individual or a corporate.
          <br /> Users will have the flexibility to include global database
          coverage of Politically Exposed Persons (PEP), Sanctions and Adverse
          Media as part of the search criteria.
        </p>
        <div className={`flex justify-between items-center`}>
          <div className="flex flex-col gap-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="sanctionLists"
                className={`h-4 w-4 rounded-full bg-color-textfield-dropdown-${theme}`}
              />
              <label
                htmlFor="sanctionLists"
                className="ml-2 text-sm font-medium text-white"
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
                className="ml-2 text-sm font-medium text-white"
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
                className="ml-2 text-sm font-medium text-white"
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
        <Button text='Advance Filters' className={`text-white text-sm font-light bg-color-button-${theme} px-4 py-6 rounded-md ml-auto`}/>
        <Button text='Quick Scan' className={`text-white text-sm font-light bg-color-button1-${theme} px-4 py-6 rounded-md mx-auto my-2`}/>
        </div>

        
    </div>
   
  </>
  );
};

export default QuickScan;
