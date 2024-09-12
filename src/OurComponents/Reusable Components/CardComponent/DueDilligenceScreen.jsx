import React from "react";
import { useTheme } from "../../../contexts/themeContext";
import { LuSearch } from "react-icons/lu";
import Table from "../Tables/Table";

const DueDilligenceScreen = () => {
  const { theme } = useTheme();
  const Headers = ["Belongs To", "Type", "Sub Type", "Expiry Date", "Action"];
  return (
    <div className={`bg-color-header-${theme} py-10`}>
      <p className={`text-xs text-center text-[#6b82a1] px-64 leading-relaxed`}>
        One Constellation performs scans of your customer list against key
        sanction list and terrorist list tracked by OCscan engine. The system
        default scan frequency is set as daily. The Ongoing Due Diligences
        displays the historic audit trail of the daily scan performed. You can
        filter the list to display customers with hits only.
      </p>
      <div className={`flex justify-between px-4 pt-8`}>
        <div className={`flex gap-2 items-center`}>
          <input
            type="text"
            id="search"
            placeholder="Select Start Date"
            className={`w-full bg-color-textfield-dropdown-${theme} py-2 px-4 rounded-md my-4`}
          />
          <p className={`text-white`}>To</p>
          <input
            type="text"
            id="search"
            placeholder="Select End Date"
            className={`w-full bg-color-textfield-dropdown-${theme} py-2 px-4 rounded-md my-4`}
          />
        </div>
        <div>
          <div className={`flex gap-2 items-center`}>
            <input
              type="text"
              id="search"
              placeholder="Search by name"
              className={`w-full bg-color-textfield-dropdown-${theme} py-2 px-4 rounded-md my-4`}
            />
            <LuSearch color="white" size={20} />
          </div>
        </div>
      </div>

      <div className={`flex justify-between px-4 pt-4`}>
        <div className="flex gap-10 items-center">
          <label className="flex items-center">
            <input
              type="radio"
              name="option"
              value="All"
              className="form-radio rounded-full text-blue-500"
            />
            <span className="ml-2 text-white">All</span>
          </label>

          <label className="flex items-center">
            <input
              type="radio"
              name="option"
              value="Individual"
              className="form-radio rounded-full text-blue-500"
            />
            <span className="ml-2 text-white">Individual</span>
          </label>

          <label className="flex items-center">
            <input
              type="radio"
              name="option"
              value="Corporate"
              className="form-radio rounded-full text-blue-500"
            />
            <span className="ml-2 text-white">Corporate</span>
          </label>
        </div>

        <div className="flex gap-10 items-center">
          <label className="flex items-center">
            <input
              type="radio"
              name="option"
              value="both"
              className="form-radio rounded-full text-blue-500"
            />
            <span className="ml-2 text-white">Both</span>
          </label>

          <label className="flex items-center">
            <input
              type="radio"
              name="option"
              value="action"
              className="form-radio rounded-full text-blue-500"
            />
            <span className="ml-2 text-white">Action Required</span>
          </label>

          <label className="flex items-center">
            <input
              type="radio"
              name="option"
              value="hit"
              className="form-radio rounded-full text-blue-500"
            />
            <span className="ml-2 text-white">No hit</span>
          </label>
        </div>
      </div>
      {/* <Table /> */}
    </div>
  );
};

export default DueDilligenceScreen;
