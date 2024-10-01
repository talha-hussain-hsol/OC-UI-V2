import React, { useState } from "react";
import CardHeader from "../header/CardHeader";
import Table from "../table/Table";
import AddBankForm from "../ui/forms/AddBankForm";
import { useTheme } from "../../contexts/themeContext";
import Button from "../ui/button/Button";

const BankCard = () => {
  const { theme } = useTheme();
  const [isAddBankModalOpen, setAddBankModalOpen] = useState(false);

  const handleOpenModal = () => {
    setAddBankModalOpen(true);
  };

  const handleCloseModal = () => {
    setAddBankModalOpen(false);
  };

  const bankHeaders = [
    "Label",
    "Bank Name",
    "Account Number",
    "Swift/IFSC",
    "Currency",
    "Status",
    "Action",
  ];
  const walletHeaders = ["Chain", "Address", "Action"];

  const rows = [];

  return (
    <>
      <div
        className={`bg-color-card-${theme} rounded-md border-color-${theme} border-[1px] shadow-${theme} mb-16 px-2 sm:px-4 flex flex-col items-center justify-center h-full w-full`}
      >
        <CardHeader
          FundName="Add Wallets"
          fundClassName={`text-color-text-${theme}`}
          showLogo={false}
          showField={false}
        />
        <Button text='Submit' className={`bg-color-button-${theme} text-white font-medium rounded-full py-6 sm:px-7 px-2 text-xs sm:text-lg my-10`}/>
      </div>
      <div
        className={`bg-color-card-${theme} rounded-md border-color-${theme} border-[1px] shadow-${theme} mb-16 px-2 sm:px-4 flex flex-col items-center justify-center h-full w-full`}
      >
        <CardHeader
          FundName="Wallet List"
          fundClassName={`text-color-text-${theme}`}
          showLogo={false}
          showField={false}
        />
        <Table
          headers={walletHeaders}
          rows={rows}
          headerClassName={`bg-color-table-color-${theme}`}
          renderRow={(row) => (
            <>
              <td className="py-4 px-2 sm:px-6">{row.chain}</td>
              <td className="py-4 px-2 sm:px-6">{row.address}</td>
              <td className="py-4 px-2 sm:px-6">{row.action}</td>
            </>
          )}
        />
      </div>
      <div
        className={`bg-color-card-${theme} rounded-md border-color-${theme} border-[1px] shadow-${theme} mb-16 px-2 sm:px-4 flex flex-col items-center justify-center h-full w-full`}
      >
        <CardHeader
          FundName="Bank List"
          fundClassName={`text-color-text-${theme}`}
          showButton={true}
          BtnText="Add New Bank"
          showLogo={false}
          BtnClassName={`bg-color-button-${theme} text-white font-medium rounded-lg py-6 sm:px-7 px-2 text-xs sm:text-lg`}
          onClick={handleOpenModal} // Open the modal here
          showField={false}
        />
        <Table
          headers={bankHeaders}
          rows={rows}
          headerClassName={`bg-color-table-color-${theme}`}
          renderRow={(row) => (
            <>
              <td className="py-4 px-2 sm:px-6">{row.label}</td>
              <td className="py-4 px-2 sm:px-6">{row.bankName}</td>
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
    </>
  );
};

export default BankCard;
