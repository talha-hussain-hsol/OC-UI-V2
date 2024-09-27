import React, { useState, useEffect } from "react";
import Header from "../../../../components/header/Header";
import SideBar from "../../../../components/sidebar/Sidebar";
import Button from "../../../../components/ui/button/Button";
import Dropdown from "../../../../components/ui/dropdown/Dropdown";
import Table from "../../../../components/table/Table";
import CardHeader from "../../../../components/header/CardHeader";
import { useTheme } from "../../../../contexts/themeContext";

const MainDocuments = () => {
  const { theme } = useTheme();
  const [documentCategory, setDocumentCategory] = useState("");
  const [fund, setFund] = useState("");
  const [asOfDate, setAsOfDate] = useState("");
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
  const Headers = [
    "Document Description",
    "Fund",
    "Valuation Date",
    "Posting Date",
  ];
  const Rows = [
    {
      doc: "Account Statement",
      fund: "Standard Chartered Client's Fund",
      Vdate: "12/06/2024",
      pDate: "12/06/2024",
    },
    {
      doc: "Account Statement",
      fund: "Standard Chartered Client's Fund",
      Vdate: "12/06/2024",
      pDate: "12/06/2024",
    },
  ];
  const documentCategoryOptions = [
    "Select Document Category",
    "Account Statement",
    "Contract Note",
    "Order Acknowledgement",
    "Valuation Statement",
  ];
  const fundOptions = ["Standard Chartered Client's Fund"];
  return (
    <div className={`bg-color-${theme}`}>
      <SideBar portalType="Customer" />
      <div className="py-6 sm:ml-12 mx-4 sm:px-10 ">
        <div className="w-full">
          <Header
            heading="Documents"
            subheading="Investor Portal"
            showButton={false}
            theme={theme}
          />
          <div
            className={`bg-color-card-${theme} rounded-md  mb-8 flex flex-col items-center justify-center h-full sm:ml-6 shadow-${theme}`}
          >
            <CardHeader
              showLogo={false}
              showButton={false}
              FundName="Documents"
              fundClassName={`text-color-text-${theme} `}
              className=""
              showField={false}
            />
            <div className="flex flex-col items-center w-full sm:flex-row py-10 px-4 sm:px-10 gap-6 z-10">
              <Dropdown
                label="Document Category"
                options={documentCategoryOptions}
                value={documentCategory}
                onChange={(e) => setDocumentCategory(e.target.value)}
                className={`flex flex-col text-color-h1-${theme} sm:w-1/4 w-full z-0`}
              />
              <Dropdown
                label="Fund"
                options={fundOptions}
                value={fund}
                onChange={(e) => setFund(e.target.value)}
                className={`flex flex-col text-color-h1-${theme} sm:w-1/4 w-full z-0`}
              />
              <div
                className={`relative flex flex-col text-color-h1-${theme} sm:w-1/4 w-full`}
              >
                <label className="mb-2">As of Date</label>
                <input
                  type="text"
                  value={asOfDate}
                  onFocus={(e) => (e.target.type = "")}
                  onBlur={(e) => (e.target.type = asOfDate ? "text" : "text")}
                  placeholder="As Of Date"
                  onChange={(e) => setAsOfDate(e.target.value)}
                  className={`bg-color-textfield-dropdown-${theme} text-color-h1-${theme} p-2  rounded-md  placeholder-[#6e84a3] text-sm`}
                />
              </div>
              <div>
                <Button
                  className={`bg-color-button-${theme} text-white py-6 px-6 font-light rounded-md`}
                  text="Clear Filter"
                />
              </div>
            </div>
          </div>
          <div
            className={`bg-color-card-${theme} rounded-md  mb-8 flex flex-col items-center justify-center h-full sm:ml-6 shadow-${theme}`}
          >
            <CardHeader
              FundName="Search Result"
              fundClassName={`text-color-text-${theme} `}
              showButton={false}
              BtnText="Add New Bank"
              showLogo={false}
              showField={true}
              fieldPlaceholder="Filter Document"
            />
            <div className="w-full mt-4">
              <Table
                headers={Headers}
                rows={Rows}
                headerClassName={`bg-color-table-color-${theme}`}
                renderRow={(row) => (
                  <>
                    <td className="py-4 px-6 text-[#2e77e7] text-xs">
                      {row.doc}
                    </td>
                    <td className="py-4 px-6 text-[#2e77e7] text-xs">
                      {row.fund}
                    </td>
                    <td className="py-4 px-6 text-[#2e77e7] text-xs">
                      {row.Vdate}
                    </td>
                    <td className="py-4 px-6 text-[#2e77e7] text-xs">
                      {row.pDate}
                    </td>
                  </>
                )}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default MainDocuments;
