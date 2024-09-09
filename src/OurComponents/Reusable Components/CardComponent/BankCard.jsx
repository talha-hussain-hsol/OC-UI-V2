import React, { useState } from "react";
import CardHeader from "./CardHeader";
import Table from "../Tables/Table";
import AddBankForm from "../../Forms/AddBankForm";
import { useTheme } from "../../../contexts/themeContext";

const BankCard = () => {
  const { theme } = useTheme();
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
    <div className={`bg-color-card-${theme} rounded-md border-color-${theme} border-[1px] shadow-${theme} mb-16 px-2 sm:px-4 flex flex-col items-center justify-center h-full w-full`}>
      <CardHeader
        FundName="Bank List"
        fundClassName={`text-color-text-${theme}`}
        showButton={true}
        BtnText="Add New Bank"
        showLogo={false}
        BtnClassName={`bg-color-button-${theme} text-white font-medium rounded-lg py-6 px-7`}
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
