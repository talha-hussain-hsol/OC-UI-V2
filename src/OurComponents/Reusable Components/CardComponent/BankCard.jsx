import React, { useState } from "react";
import CardHeader from "./CardHeader";
import Table from "../Tables/Table";
import AddBankForm from "../../Forms/AddBankForm";

const BankCard = () => {
  const [isAddBankModalOpen, setAddBankModalOpen] = useState(false);

  const handleOpenModal = () => {
    setAddBankModalOpen(true);
  };

  const handleCloseModal = () => {
    setAddBankModalOpen(false);
  };

  const headers = [
    "Label",
    "Bank Name",
    "Account Type",
    "Account Number",
    "Swift/IFSC",
    "Currency",
    "Status",
    "Action",
  ];

  const rows = [];

  return (
    <div className="bg-gradient-to-b from-[#0e325a] from-10% to-[#141c3a] to-100% rounded-md border-[#1b3050] border-[1px] shadow-[0px_6px_20px_rgba(0,0,0,0.9)] mb-16 px-2 sm:px-4 flex flex-col items-center justify-center h-full w-full">
      <CardHeader
        FundName="Bank List"
        fundClassName="text-white"
        showButton={true}
        BtnText="Add New Bank"
        showLogo={false}
        BtnClassName="bg-[#2c7be5] text-white font-medium border border-gray-700 rounded-lg py-6 px-7"
        onClick={handleOpenModal} // Open the modal here
        showField={false}
      />
      <Table
        headers={headers}
        rows={rows}
        renderRow={(row) => (
          <>
            <td className="py-4 px-2 sm:px-6">{row.label}</td>
            <td className="py-4 px-2 sm:px-6">{row.bankName}</td>
            <td className="py-4 px-2 sm:px-6">{row.accountType}</td>
            <td className="py-4 px-2 sm:px-6">{row.accountNumber}</td>
            <td className="py-4 px-2 sm:px-6">{row.swift}</td>
            <td className="py-4 px-2 sm:px-6">{row.currency}</td>
            <td className="py-4 px-2 sm:px-6">{row.status}</td>
            <td className="py-4 px-2 sm:px-6">{row.action}</td>
          </>
        )}
      />
      {/* AddBankForm Component */}
      <AddBankForm isOpen={isAddBankModalOpen} onClose={handleCloseModal} />
    </div>
  );
};

export default BankCard;
