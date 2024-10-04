import React, { useState } from "react";
import CardHeader from "../header/CardHeader";
import Table from "../table/Table";
import AddBankForm from "../ui/forms/AddBankForm";
import { useTheme } from "../../contexts/themeContext";
import { RiDeleteBin7Line } from "react-icons/ri";

import { MdOutlineWorkHistory } from "react-icons/md";
import { LuInfo } from "react-icons/lu";
import Button from "../ui/button/Button";
import Dropdown from "../ui/dropdown/Dropdown";
import DynamicModal from "../modal";
import { addWalletAddressAPI, deleteBankWalletAPI } from "../../api/userApi";
import axios from "axios";
import Loader from "../ui/loader";
import useBankWalletHook from "../../hooks/useBankWalletHook";

const BankCard = ({
  bankIdentities,
  walletAddresses,
  setWalletAddresses,
  fetchWalletAddresses,
  fetchBankAddressIdentities,
}) => {
  const { isLoaderBank, fetchAllData, fetchBankIdentities } =
    useBankWalletHook();
  const { theme } = useTheme();
  const [isAddBankModalOpen, setAddBankModalOpen] = useState(false);
  const [CryptoCurrency, setCryptoCurrency] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [walletAddressError, setWalletAddressError] = useState(false);
  const [cryptoCurrencyError, setCryptoCurrencyError] = useState(false);
  const [isLoader, setIsLoader] = useState(false);
  const cancelTokenSource = axios.CancelToken.source();
  const [walletToDelete, setWalletToDelete] = useState(null);
  const [showModal, setShowModal] = useState(null);

  const handleOpenModal = () => {
    setAddBankModalOpen(true);
  };

  const handleCloseModal = () => {
    setAddBankModalOpen(false);
  };
  const CryptoCurrenyOptions = [
    "Select CryptoCurrency",
    "BTC",
    "ETH / ERD-20",
    "LTC",
    "TRX",
    "EOS",
    "XLM",
    "ADA",
    "BNB",
    "BCH",
    "XRP",
    "BSC",
    "KLAY",
  ];
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

  const submitWalletAddress = async (dataToSend) => {
    // setIsLoader(true);
    try {
      const response = await addWalletAddressAPI(
        dataToSend,
        cancelTokenSource.token
      );
      console.log("Add Wallet API Response:", response);
      // setIsLoader(false);
      if (response.success === true) {
        await fetchWalletAddresses();
      } else {
        console.error(response.message || "Failed to add wallet address.");
      }
    } catch (error) {
      console.error("Error adding wallet address:", error);
    } finally {
      setIsLoader(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (walletAddress === "" || CryptoCurrency === "") {
      if (walletAddress === "") {
        setWalletAddressError(true);
      } else {
        setWalletAddressError(false);
      }
      if (CryptoCurrency === "") {
        setCryptoCurrencyError(true);
      } else {
        setCryptoCurrencyError(false);
      }
      return;
    } else {
      setWalletAddressError(false);
      setCryptoCurrencyError(false);
      let dataToSend = {
        chain: CryptoCurrency,
        address: walletAddress,
      };
      setIsLoader(true);
      await submitWalletAddress(dataToSend);
    }
  };

  const handleDeleteClick = (wallet) => {
    setWalletToDelete(wallet);
    setShowModal(true);
  };
  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleDeleteConfirm = async () => {
    if (walletToDelete) {
      try {
        console.log("Deleting Wallet:", walletToDelete);
        const response = await deleteBankWalletAPI(cancelTokenSource.token);
        console.log("Delete API Response:", response);

        setWalletAddresses((prev) =>
          prev.filter((wallet) => wallet.id !== walletToDelete.id)
        );
      } catch (error) {
        console.error("Error deleting wallet address:", error);
      }
    }
    setShowModal(false);
  };
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
        <div className="flex gap-6 mt-8 items-center justify-between w-full ">
          <div className="flex flex-col w-full gap-2">
            <Dropdown
              label="CryptoCurrency"
              options={CryptoCurrenyOptions}
              value={CryptoCurrency}
              onChange={(e) => setCryptoCurrency(e.target.value)}
              className={`flex flex-col text-color-h1-${theme}  w-full z-0 `}
            />
            <span
              className={`text-red-600 z-10 h-4 ${
                cryptoCurrencyError ? "" : "invisible"
              }`}
            >
              Select CryptoCurrency to Continue
            </span>
          </div>

          <div className={`flex flex-col gap-2 text-color-h1-${theme} w-full`}>
            <label>Wallet Address</label>
            <input
              type="text"
              value={walletAddress}
              onFocus={(e) => (e.target.type = "")}
              placeholder="Wallet Address"
              onChange={(e) => setWalletAddress(e.target.value)}
              className={`bg-color-textfield-dropdown-${theme} text-color-h1-${theme} shadow-${theme} p-3  rounded-md  placeholder-[#6e84a3] text-sm`}
            />
            <span
              className={`text-red-600 h-4 ${
                walletAddressError ? "" : "invisible"
              }`}
            >
              Enter Wallet Address to Continue
            </span>
          </div>
        </div>

        <Button
          text="Submit"
          className={`bg-[#3DA500] text-white font-medium rounded-full py-6 sm:px-7 px-2 text-xs sm:text-lg my-10`}
          onClick={(e) => {
            handleSubmit(e);
          }}
        />
      </div>
      {isLoader && <Loader theme={theme} />}
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
          rows={walletAddresses}
          headerClassName={`bg-color-table-color-${theme}`}
          renderRow={(row) => (
            <>
              <td className="py-4 px-2 sm:px-6">{row.meta?.data?.chain}</td>
              <td className="py-4 px-2 sm:px-6">{row.meta?.data?.address}</td>
              <td className="py-4 px-2 sm:px-6">
                <RiDeleteBin7Line
                  size={18}
                  color="red"
                  onClick={() => handleDeleteClick(row)}
                />
              </td>
            </>
          )}
        />
      </div>
      <DynamicModal
        show={showModal}
        handleClose={handleModalClose}
        handleConfirm={handleDeleteConfirm}
        title="Confirmation Message"
        body={`Are you sure you want to delete this Identity?`}
      />
      {isLoaderBank && <Loader theme={theme} />}
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
          onClick={handleOpenModal}
          showField={false}
        />
        <Table
          headers={bankHeaders}
          rows={bankIdentities}
          headerClassName={`bg-color-table-color-${theme}`}
          renderRow={(row) => (
            <>
              <td className="py-4 px-2 sm:px-6 uppercase">{row.label}</td>
              <td className="py-4 px-2 sm:px-6 uppercase">
                {row.meta.data["bank.basic.bank_name"]}
              </td>
              <td className="py-4 px-2 sm:px-6 uppercase">
                {row.meta.data["bank.basic.account_number"]}
              </td>
              <td className="py-4 px-2 sm:px-6 uppercase">
                {row.meta.data["bank.basic.swift_bic__ifsc_code"]}
              </td>
              <td className="py-4 px-2 sm:px-6 uppercase">
                {row.meta.data["bank.basic.currency"]}
              </td>
              <td className="py-4 px-2 sm:px-6 text-[#f39f08] uppercase">{row.status}</td>
              <td className="py-4 px-2 sm:px-6 flex gap-2 items-center">
                <RiDeleteBin7Line size={18} color="red" />
                <MdOutlineWorkHistory size={18} color="white" />
                <LuInfo size={18} color="white" />
              </td>
            </>
          )}
        />
        {/* AddBankForm Component */}
        <AddBankForm
          isOpen={isAddBankModalOpen}
          onClose={handleCloseModal}
          fetchBankIdentities={fetchBankIdentities}
        />
      </div>
    </>
  );
};

export default BankCard;
