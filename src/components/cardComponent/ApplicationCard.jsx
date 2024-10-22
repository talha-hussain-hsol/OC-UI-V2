import React, { useRef, useState, useEffect } from "react";
import CardHeader from "../header/CardHeader";
import Table from "../table/Table";
import { useTheme } from "../../contexts/themeContext";
import { RiDeleteBin7Line } from "react-icons/ri";
import DynamicModal from "../modal";
import { FaFileSignature } from "react-icons/fa6";
import UploadDocument from "../modal/UploadDocument";
import { transactionDocAddApi } from "../../api/userApi";
import axios from "axios";
import Loader from "../ui/loader";
import { MdOutlineFileDownload } from "react-icons/md";

const ApplicationCard = ({
  transactionHistory,
  fetchTransactionHistory,
  fetchTransactionHistoryAPI,
  documentHistory,
}) => {
  const { theme } = useTheme();
  const [showModal, setShowModal] = useState(null);
  const [currencyError, setCurrencyError] = useState(false);
  const [amountError, setAmountError] = useState(false);
  const [currency, setCurrency] = useState(false);
  const [amount, setAmount] = useState(false);
  const [showManualDropdown, setShowManualDropdown] = useState(false);
  const [showDigitalDropdown, setShowDigitalDropdown] = useState(false);
  const [uploadDocument, setUploadDocument] = useState(false);

  const [documentTypeId, setDocumentTypeId] = useState(null);
  const cancelTokenSource = axios.CancelToken.source();
  const [isLoading, setIsLoading] = useState(false);

  const isManualDropdownRef = useRef(null);
  const isDigitalDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isManualDropdownRef.current &&
        !isManualDropdownRef.current.contains(event.target)
      ) {
        setShowManualDropdown(false);
      }

      if (
        isDigitalDropdownRef.current &&
        !isDigitalDropdownRef.current.contains(event.target)
      ) {
        setShowDigitalDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleModalClose = () => {
    setShowModal(false);
  };
  const handleUploadDocument = () => {
    setUploadDocument(true);
    setShowManualDropdown(false);
  };
  const handleClickManual = () => {
    setShowManualDropdown(true);
    // setUploadDocument(false);
  };

  const closeUploadDocument = () => {
    setUploadDocument(false);
  };

  const historyHeaders = ["Type", "Date", "Status", "Action"];
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
      type: "abc",
      date: "abc",
      status: "pending",
      esign: "sad",
    },
  ];
  const handleUpload = async (data) => {
    handleModalClose();
    try {
      setIsLoading(true);

      const response = await transactionDocAddApi(
        data,
        cancelTokenSource.token
      );

      if (response.success === true) {
        await fetchTransactionHistory();
        await fetchTransactionHistoryAPI();
      } else {
        console.error(response.message || "Failed to add wallet address.");
      }
    } catch (error) {
      console.error("Error uploading document:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const amountValid = amount && amount.trim() !== "";
    const currencyValid = currency && currency !== "Select Currency";

    if (!amountValid || !currencyValid) {
      setAmountError(!amountValid);
      setCurrencyError(!currencyValid);
      return;
    }
    setCurrencyError(false);
    setAmountError(false);
    let dataToSend = {
      account_id: "751550b6-e031-439c-bc7e-e2343ce52baf",
      currency: currency,
      amount: amount,
      type: "subscription",
      document_type_id: 101,
    };
    setIsLoading(true);
    await handleUpload(dataToSend);
    // setDocHistory(true);
  };

  return (
    <>
      {isLoading ? (
        <Loader theme={theme} />
      ) : (
        <>
          <div
            className={`bg-color-card-${theme} rounded-md  shadow-${theme} mb-8 flex flex-col items-center justify-center h-full w-full`}
          >
            <CardHeader
              FundName="Review & Sign Documents"
              fundClassName={`text-color-h1-${theme} uppercase `}
              showButton={false}
              BtnText="Add New Bank"
              showLogo={false}
            />
            <Table
              headers={["Type", "Date", "Status", "Stamp", "Action"]}
              rows={docRows}
              headerClassName={`bg-color-table-color-${theme}`}
              renderRow={(row) => (
                <>
                  <td className="py-4 px-4 font-light">
                    Subscription Agreement
                  </td>
                  <td className="py-4 px-4">
                    {documentHistory && documentHistory !== null
                      ? row.docUploadDateTime
                      : ""}
                  </td>
                  <td className="py-4 px-4">
                    {documentHistory && documentHistory !== null
                      ? ""
                      : "Not Completed"}
                  </td>
                  <td className="py-4 px-4">
                    {documentHistory && documentHistory !== null ? (
                      <button className="text-white text-md bg-[#2c7be5] py-4 px-6 rounded-lg hover:bg-[#2569c3]">
                        Proceed
                      </button>
                    ) : (
                      ""
                    )}
                  </td>
                  <td className="py-4 px-4">
                    {documentHistory && documentHistory !== null ? (
                      <div className="flex gap-2 items-center ">
                        <MdOutlineFileDownload size={24} color="#047a07" />
                        <button
                          className="text-white text-md bg-[#2c7be5] py-4 px-6 rounded-lg hover:bg-[#2569c3]"
                          onClick={() => setShowModal(true)}
                        >
                          Re-sign
                        </button>
                      </div>
                    ) : (
                      <button
                        className="text-white bg-[#e63757] py-4 px-6 rounded-lg hover:bg-[#c4304a]"
                        onClick={() => setShowModal(true)}
                      >
                        Sign and Submit
                      </button>
                    )}
                  </td>
                </>
              )}
            />
          </div>

          <div
            className={`bg-color-card-${theme} rounded-md  shadow-${theme} mb-8 flex flex-col items-center justify-center h-full w-full`}
          >
            <CardHeader
              FundName="Transaction History"
              fundClassName={`text-color-h1-${theme} uppercase `}
              showButton={false}
              showLogo={false}
            />
            <Table
              headers={THistoryHeaders}
              rows={transactionHistory}
              headerClassName={`bg-color-table-color-${theme}`}
              renderRow={(row) => (
                <>
                  <td className="py-4 px-6 capitalize">{row.type}</td>
                  <td className="py-4 px-6 ">{row.amount}</td>
                  <td className="py-4 px-6 ">
                    {row.meta?.moreInfo?.no_of_shares}
                  </td>
                  <td className="py-4 px-6 uppercase">{row.currency}</td>

                  <td className="py-4 px-6 capitalize">
                    {row?.status == "pending"
                      ? "Pending For Review"
                      : row?.status}
                  </td>
                  <td className="py-4 px-6">{row.transactionDate}</td>
                  <td className="py-4 px-6">{"6.15 USD (SCB)"}</td>
                  <td className="py-4 px-6">{"--"}</td>
                  <td className="py-4 px-6">
                    <RiDeleteBin7Line size={18} color="red" />
                  </td>
                </>
              )}
            />

            <DynamicModal
              show={showModal}
              handleClose={handleModalClose}
              title="Please Select Document Signing Mode"
              proceedBtn={false}
              className="md:w-1/2 w-full max-h-[100%] overflow-y-auto"
              body={
                <div className="flex flex-col items-center">
                  <div className="w-full">
                    <div className="flex justify-between gap-4 mb-16">
                      {/* Amount input */}
                      <div className="w-full">
                        <input
                          type="number"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          id="amount"
                          className={`w-full p-2.5 bg-color-textfield-${theme} shadow-${theme} rounded-md border border-[#1c3758] placeholder-[#6e84a3] focus:ring-2 focus:ring-blue-500`}
                          placeholder="Enter amount"
                        />
                        <span
                          className={`text-red-600 text-sm h-4 block mt-1 ${
                            amountError ? "" : "invisible"
                          }`}
                        >
                          Amount is Required
                        </span>
                      </div>
                      <div className="w-1/2">
                        <select
                          id="currency"
                          value={currency}
                          onChange={(e) => setCurrency(e.target.value)}
                          placeholder=""
                          className={`w-full p-3 bg-color-textfield-${theme} shadow-${theme} rounded-md border border-[#1c3758] placeholder-[#6e84a3] focus:ring-2 focus:ring-blue-500`}
                        >
                          <option
                            value="Select Currency"
                            className="text-[#6e84a3]"
                          >
                            Select Currency
                          </option>
                          <option value="USD">USD</option>
                          <option value="SGD">SGD</option>
                          <option value="BTC">BTC</option>
                        </select>
                        <span
                          className={`text-red-600 text-sm h-4 block mt-1 ${
                            currencyError ? "" : "invisible"
                          }`}
                        >
                          Currency is Required
                        </span>
                      </div>
                    </div>

                    {/* Flex row for signature buttons */}
                    <div className="relative">
                      <div className="flex justify-between gap-4">
                        <button
                          onClick={handleClickManual}
                          className="flex items-center gap-4 px-6 py-3 text-lg font-light text-white bg-[#2c7be5] rounded-md hover:bg-[#2569c3] transition-all duration-300 ease-in-out transform hover:-translate-y-1"
                        >
                          <FaFileSignature color="white" size={18} />
                          Manual Signature
                        </button>
                        <button
                          onClick={() =>
                            setShowDigitalDropdown(!showDigitalDropdown)
                          }
                          className="flex items-center gap-4 px-6 py-3 text-lg font-light text-white bg-[#2c7be5] rounded-md hover:bg-[#2569c3] transition-all duration-300 ease-in-out transform hover:-translate-y-1"
                        >
                          <FaFileSignature color="white" size={18} />
                          Digital Signature
                        </button>
                      </div>
                      {showManualDropdown && (
                        <div className="flex  justify-center">
                          <div
                            ref={isManualDropdownRef}
                            className="absolute left-0 mt-[-10px] w-56 border border-[#12273f] bg-gradient-to-b from-[#407dc6] to-[#163151] rounded-md shadow-lg"
                          >
                            <ul className="py-1">
                              <li
                                className="px-4 py-4 text-white text-sm hover:bg-gradient-to-b from-[#70888e] to-[#214267] cursor-pointer"
                                onClick={handleUploadDocument}
                              >
                                Upload Document
                              </li>
                              <li
                                className="px-4 py-4 text-white text-sm hover:bg-gradient-to-b from-[#70888e] to-[#214267] cursor-pointer"
                                onClick={() => {
                                  console.log("Download Document");
                                }}
                              >
                                Download Document
                              </li>
                            </ul>
                          </div>
                        </div>
                      )}
                      {showDigitalDropdown && (
                        <div
                          ref={isDigitalDropdownRef}
                          className="absolute right-0 mt-[-10px] w-52 border border-[#12273f] bg-gradient-to-b from-[#407dc6] to-[#163151] rounded-md shadow-lg"
                        >
                          <ul className="py-2">
                            <li
                              className="px-4 py-4 text-white text-sm hover:bg-gradient-to-b from-[#70888e] to-[#214267] cursor-pointer"
                              onClick={() => {
                                console.log("Upload Document");
                              }}
                            >
                              Asd
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                  {uploadDocument && (
                    <UploadDocument
                      onClose={closeUploadDocument}
                      handleSubmit={handleSubmit}
                      isLoading={isLoading}
                    />
                  )}
                </div>
              }
            />
          </div>
        </>
      )}
    </>
  );
};

export default ApplicationCard;
