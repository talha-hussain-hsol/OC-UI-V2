import React from "react";
import CardHeader from "./CardHeader";
import Table from "../Tables/Table";

const ApplicationCard = () => {
  const DocHeaders = ["Type", "Date", "Status", "E Sign", "Action"];
  const THistoryHeaders = [
    "Subscription Type",
    "Amount",
    "No of shares",
    "Currency",
    "Status",
    "Date",
    "Last Nav Price",
    "No of shares Owned",
    "Action",
  ];

  const docRows = [
    {
      type: "Subscription Application",
      date: "",
      status: "Not Completed",
      esign: "",
      actionText: "Sign & Submit",
    },
    {
      type: "Subscription Application",
      date: "",
      status: "Not Completed",
      esign: "",
      actionText: "Sign & Submit",
    },
  ];

  const historyRows = [];

  return (
    <>
      <div className="bg-gradient-to-b from-[#0e325a] from-10% to-[#141c3a] to-100% rounded-md border-[#1b3050] border-[1px] shadow-[0px_6px_20px_rgba(0,0,0,0.9)] mb-8 flex flex-col items-center justify-center h-full w-full">
        <CardHeader
          FundName="Review & Sign Documents"
          fundClassName="text-white"
          showButton={false}
          BtnText="Add New Bank"
          showLogo={false}
        />
        <Table
          headers={DocHeaders}
          rows={docRows}
          renderRow={(row) => (
            <>
              <td className="py-4 px-4 uppercase">{row.type}</td>
              <td className="py-4 px-4">{row.date}</td>
              <td className="py-4 px-4">{row.status}</td>
              <td className="py-4 px-4">{row.esign}</td>
              <td className="py-4 px-4">
                <button className="bg-[#e63757] text-white py-3 px-8 font-medium rounded-md hover:bg-[#c4304a] transition-all duration-200 ease-in-out">
                  {row.actionText}
                </button>
              </td>
            </>
          )}
        />
      </div>
      <div className="bg-gradient-to-b from-[#0e325a] from-10% to-[#141c3a] to-100% rounded-md border-[#1b3050] border-[1px] shadow-[0px_6px_20px_rgba(0,0,0,0.9)] mb-8 flex flex-col items-center justify-center h-full w-full">
        <CardHeader
          FundName="Trasaction History"
          fundClassName="text-white"
          showButton={false}
          BtnText="Add New Bank"
          showLogo={false}
        />
        <Table
          headers={THistoryHeaders}
          rows={historyRows}
          renderRow={(row) => (
            <>
              <td className="py-4 px-6 uppercase">{row.standardType}</td>
              <td className="py-4 px-6 uppercase">{row.amount}</td>
              <td className="py-4 px-6 uppercase">{row.NoOfShare}</td>
              <td className="py-4 px-6 uppercase">{row.currency}</td>

              <td className="py-4 px-6">{row.status}</td>
              <td className="py-4 px-6">{row.date}</td>
              <td className="py-4 px-6">{row.lastNavPrice}</td>
              <td className="py-4 px-6">{row.NoOfShareOwned}</td>
              <td className="py-4 px-6">
                <button className="bg-[#e63757] text-white py-3 px-8 font-medium rounded-md">
                  {row.actionText}
                </button>
              </td>
            </>
          )}
        />
      </div>
    </>
  );
};

export default ApplicationCard;
