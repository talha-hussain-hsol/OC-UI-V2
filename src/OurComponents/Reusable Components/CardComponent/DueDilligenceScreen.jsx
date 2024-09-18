import React from "react";
import { useTheme } from "../../../contexts/themeContext";
import { LuSearch } from "react-icons/lu";
import Table from "../Tables/Table";
import Button from "../Button";

const DueDilligenceScreen = () => {
  const { theme } = useTheme();
  const Headers = ["Name", "Customer Type", "Update At", "Result"];

  const Rows = [
    {
      name: "Sopoline ella wallace",
      type: "Individual",
      updateAt: "02/09/2024 07:56:21 PM",
    },
    {
      name: "Sopoline ella wallace",
      type: "Individual",
      updateAt: "02/09/2024 07:56:21 PM",
    },
    {
      name: "Sopoline ella wallace",
      type: "Individual",
      updateAt: "02/09/2024 07:56:21 PM",
    },
    {
      name: "Sopoline ella wallace",
      type: "Individual",
      updateAt: "02/09/2024 07:56:21 PM",
    },
    {
      name: "Sopoline ella wallace",
      type: "Individual",
      updateAt: "02/09/2024 07:56:21 PM",
    },
  ];
  return (
    <div className={`bg-color-header-${theme} py-10`}>
      <p className={`text-xs text-center text-[#6b82a1] sm:px-64 leading-relaxed`}>
        One Constellation performs scans of your customer list against key
        sanction list and terrorist list tracked by OCscan engine. The system
        default scan frequency is set as daily. The Ongoing Due Diligences
        displays the historic audit trail of the daily scan performed. You can
        filter the list to display customers with hits only.
      </p>
      <div className={`sm:flex justify-between px-4 pt-8`}>
        <div className={`flex gap-2 items-center`}>
          <input
            type="text"
            id="search"
            placeholder="Select Start Date"
            className={`w-full bg-color-textfield-dropdown-${theme} py-2 px-4 rounded-md my-4`}
          />
          <p className={`text-color-text-${theme}`}>To</p>
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
            <LuSearch className={`text-color-icon-text-${theme}`} size={20} />
          </div>
        </div>
      </div>

      <div className={`sm:flex sm:justify-between px-4 pt-4`}>
        <div className="flex gap-10 items-center">
          <label className="flex items-center">
            <input
              type="radio"
              name="option"
              value="All"
              className="form-radio rounded-full text-blue-500"
            />
            <span className={`ml-2 text-color-text-${theme} sm:text-sm text-xs`}>All</span>
          </label>

          <label className="flex items-center">
            <input
              type="radio"
              name="option"
              value="Individual"
              className="form-radio rounded-full text-blue-500"
            />
            <span className={`ml-2 text-color-text-${theme} sm:text-sm text-xs`}>Individual</span>
          </label>

          <label className="flex items-center">
            <input
              type="radio"
              name="option"
              value="Corporate"
              className="form-radio rounded-full text-blue-500"
            />
            <span className={`ml-2 text-color-text-${theme} sm:text-sm text-xs`}>Corporate</span>
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
            <span className={`ml-2 text-color-text-${theme} sm:text-sm text-xs`}>Both</span>
          </label>

          <label className="flex items-center">
            <input
              type="radio"
              name="option"
              value="action"
              className="form-radio rounded-full text-blue-500"
            />
            <span className={`ml-2 text-color-text-${theme} sm:text-sm text-xs`}>
              Action Required
            </span>
          </label>

          <label className="flex items-center">
            <input
              type="radio"
              name="option"
              value="hit"
              className="form-radio rounded-full text-blue-500"
            />
            <span className={`ml-2 text-color-text-${theme} sm:text-sm text-xs`}>No hit</span>
          </label>
        </div>
      </div>
      {/* <Table /> */}
      <div className={`bg-color-header-${theme} rounded-lg shadow-${theme} mt-10 border border-color-${theme}`}>
        <Table
          headers={Headers}
          rows={Rows}
          headerClassName={`bg-color-table-bg-${theme} rounded-lg`}
          showField={true}
          className={`bg-color-header-${theme} rounded-lg`}
          renderRow={(row, index) => (
            <>
              <td className="py-4 px-6 font-light text-xs">{row.name}</td>
              <td className="py-4 px-6 font-light text-xs">{row.type}</td>

              <td
                className={`py-4 px-6 font-light text-xs text-color-icon-${theme}`}
              >
                {row.updateAt}
              </td>
              <td className="py-4 px-6 font-light text-xs flex items-center">
                <Button text='Action Required' className={'bg-[#e43555] p-4 rounded-md font-medium text-white'}/>
              </td>
            </>
          )}
        />
      </div>
    </div>
  );
};

export default DueDilligenceScreen;
