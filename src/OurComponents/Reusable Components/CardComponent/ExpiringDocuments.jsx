import React, { useState } from "react";
import { useTheme } from "../../../contexts/themeContext";
import Button from "../Button";
import Table from "../Tables/Table";
import { FaRegEdit } from "react-icons/fa";
import { FiEye } from "react-icons/fi";

const ExpiringDocuments = () => {
  const { theme } = useTheme();
  const [activeButton, setActiveButton] = useState("expiring");
  const Headers = ["Belongs To", "Type", "Sub Type", "Expiry Date", "Action"];

  const Rows = [
    {
      belongsTo: "Staging test",
      type: "Proof of residential address",
      subType: "Utility/telephone bill",
      expiry: "12/05/2023",
    },
    {
      belongsTo: "Staging test",
      type: "Proof of residential address",
      subType: "Utility/telephone bill",
      expiry: "12/05/2023",
    },
    {
      belongsTo: "Staging test",
      type: "Proof of residential address",
      subType: "Utility/telephone bill",
      expiry: "12/05/2023",
    },
    {
      belongsTo: "Staging test",
      type: "Proof of residential address",
      subType: "Utility/telephone bill",
      expiry: "12/05/2023",
    },
    {
      belongsTo: "Staging test",
      type: "Proof of residential address",
      subType: "Utility/telephone bill",
      expiry: "12/05/2023",
    },
    {
      belongsTo: "Staging test",
      type: "Proof of residential address",
      subType: "Utility/telephone bill",
      expiry: "12/05/2023",
    },
  ];
  return (
    <div className={`bg-color-header-${theme} py-10`}>
      <div className={`flex items-center justify-center `}>
        <Button
          text="Expiring Documents"
          onClick={() => setActiveButton("expiring")}
          className={`${
            activeButton === "expiring"
              ? "bg-[#2c7be5] text-white border-[#2c7be5]"
              : "bg-[#0d3e80] text-white border-[#2c7be5]"
          } py-5 px-4 rounded-l-full border border-blue-500`}
        />
        <Button
          text="Expired Documents"
          onClick={() => setActiveButton("expired")}
          className={`${
            activeButton === "expired"
              ? "bg-[#2c7be5] text-white border-[#2c7be5]"
              : "bg-[#0d3e80] text-white border-[#2c7be5]"
          } py-5 px-4 rounded-r-full border border-blue-500`}
        />
      </div>
      {activeButton === "expired" && (
        <div>
          <p className={`text-xs text-center text-[#6b82a1] py-10`}>
            Documents that have already passed their expiry date will be shown
            here, under the "Expired Documents" section. These documents require
            immediate attention, as they are no longer valid.
          </p>
          <Table
            headers={Headers}
            rows={Rows}
            headerClassName={`bg-color-table-header-${theme} `}
            // showField={true}
            className={`bg-color-header-${theme} rounded-b-lg `}
            renderRow={(row, index) => (
              <>
                <td className="py-6 px-6 font-light text-xs text-[#2e77e7]">
                  {row.belongsTo}
                </td>
                <td className="py-6 px-6 font-light text-xs">{row.type}</td>
                <td className="py-6 px-6 font-light text-xs">{row.subType}</td>
                <td className="py-6 px-6 font-light text-xs">{row.expiry}</td>

                <td className="py-6 px-6 font-light text-xs flex gap-3">
                  <FiEye size={14} color="white" />
                  <FaRegEdit size={14} color="#FFFFFF" />
                </td>
              </>
            )}
          />
        </div>
      )}

      {activeButton === "expiring" && (
        <div>
          <p className={`text-xs text-center text-[#6b82a1] py-10`}>
            Expiring Documents displays documents that are approaching their
            expiry date. By default, documents will appear here 3 months before
            they expire. If a document is due for renewal within this period, it
            will be listed under the "Expiring Documents" section.
          </p>
          <Table
            headers={Headers}
            rows={Rows}
            headerClassName={`bg-color-table-header-${theme} `}
            // showField={true}
            className={`bg-color-header-${theme} rounded-b-lg `}
            renderRow={(row, index) => (
              <>
                <td className="py-6 px-6 font-light text-xs text-[#2e77e7]">
                  {row.belongsTo}
                </td>
                <td className="py-6 px-6 font-light text-xs">{row.type}</td>
                <td className="py-6 px-6 font-light text-xs">{row.subType}</td>
                <td className="py-6 px-6 font-light text-xs">{row.expiry}</td>

                <td className="py-6 px-6 font-light text-xs flex gap-3">
                  <FiEye size={14} color="white" />
                  <FaRegEdit size={14} color="#FFFFFF" />
                </td>
              </>
            )}
          />
        </div>
      )}
    </div>
  );
};

export default ExpiringDocuments;
