import React, { useState, useEffect } from "react";
import { useTheme } from "../../contexts/themeContext";
import { postIdentityDocument } from "../../api/userApi";
import axios from "axios";
import Loader from "../ui/loader";

const Modal = ({
  id,
  title,
  children,
  onClose,
  selectedType,
  selectedFile,
  identity_id,
  requiredDocumentSelected,
  fetchIdentityDocuments,
  fetchAccountDetails,
  accountDetails,
  identityDocument,
  setAccountDetails,
  setIdentityDocument,
}) => {
  const { theme } = useTheme();
  const [errorMessage, setErrorMessage] = useState("");
  const [issueDate, setIssueDate] = useState(null);
  const [documentNumber, setDocumentNumber] = useState(null);
  const [expiryDate, setExpiryDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [documentTypeSelected, setDocumentTypeSelected] = useState("");
  const [documentErrMessage, setDocumentErrMessage] = useState("");
  const cancelTokenSource = axios.CancelToken.source();
  const [documentParentId, setDocumentParentId] = useState(null);
  const [documentTypes, setDocumentTypes] = useState([]);

  useEffect(() => {
    console.log("types modal", requiredDocumentSelected?.children);

    if (requiredDocumentSelected?.children.length > 0) {
      setDocumentTypes(requiredDocumentSelected?.children);
    } else {
      setDocumentTypes([requiredDocumentSelected]);
    }
    setDocumentParentId(requiredDocumentSelected?.id);
  }, [documentTypeSelected]);

  const handleUpload = async () => {
    if (
      (requiredDocumentSelected?.has_issued_date && !issueDate) ||
      (requiredDocumentSelected?.has_expiry_date && !expiryDate)
    ) {
      setErrorMessage("Please fill out the required fields.");
      return;
    }
    setLoading(true);
    try {
      const data = {
        document_type_id: requiredDocumentSelected?.id,
        sub_document_type_id: parseInt(documentTypeSelected) || null,
        issued_date: issueDate,
        expiry_date: expiryDate,
        document_number: documentNumber,
        content_type: "img/png",
        identity_id: identity_id,
      };
      if (issueDate) {
        data.issued_date = issueDate;
      }
      if (expiryDate) {
        data.expiry_date = expiryDate;
      }
      console.log(data);
      const response = await postIdentityDocument(
        data,
        cancelTokenSource.token
      );
      if (response.success) {
        onClose();
        setErrorMessage("");

        // setAccountDetails((prev) => ({
        //   ...prev,
        //   // documents: [
        //   //   ...(prev.documents || []),
        //   //   {
        //   //     type: requiredDocumentSelected?.name,
        //   //     issuedDate: issueDate || null,  // Ensure issued date is included
        //   //   expiryDate: expiryDate || null,
        //   //   },
        //   // ],
        // }));
        // setIdentityDocument(data);
        await fetchIdentityDocuments();
        await fetchAccountDetails();
      } else {
        setErrorMessage("Failed to upload document. Please try again.");
      }
    } catch (error) {
      setErrorMessage("An error occurred while uploading the document.");
    } finally {
      setLoading(false);
    }
  };

  const handleChangeDocumentType = (event) => {
    setDocumentTypeSelected(event.target.value);
    setDocumentErrMessage("");
    console.log("event.target.value", event.target.value);
  };

  const isUploadDisabled = () => {
    return (
      !selectedFile ||
      !documentTypeSelected ||
      (requiredDocumentSelected?.has_issued_date && !issueDate) ||
      (requiredDocumentSelected?.has_expiry_date && !expiryDate)
    );
  };

  const clearFormData = () => {
    setDocumentParentId(null);
    setDocumentTypeSelected("");
    setIssueDate(null);
    setExpiryDate(null);
    setDocumentNumber(null);
  };

  const handleClose = () => {
    clearFormData();
    onClose();
  };

  const getInputBorderColor = (isIssued, isExpired) => {
    if (isIssued && !issueDate) return "border-orange-500";
    if (isExpired && !expiryDate) return "border-orange-500";
    return `border-color-${theme}`;
  };

  return (
    <div
      id={id}
      tabIndex="-1"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-y-scroll scrollbar-thin max-h-[100%] "
      onClick={onClose}
    >
      <div
        className={`relative bg-color-modal-${theme} mt-20 rounded-lg shadow-lg w-full max-w-6xl mx-4 md:mx-6 lg:mx-8`}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`bg-color-modal-${theme} flex items-center justify-between py-5 px-8 border-b border-color-modal-${theme} rounded-t-lg`}
        >
          <h3 className="text-lg font-light text-white ">{title}</h3>
          <button
            type="button"
            className="text-gray-400 hover:text-white transition-all ease-in-out bg-transparent rounded-lg text-sm w-8 h-8 flex items-center justify-center"
            onClick={handleClose}
          >
            <svg
              className="w-4 h-4"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
            <span className="sr-only">Close modal</span>
          </button>
        </div>

        {loading ? (
          <Loader theme={theme} />
        ) : (
          <div className="flex flex-col lg:flex-row">
            <div
              className={`flex flex-col items-center justify-center bg-transparent p-4 md:p-6 lg:p-8 rounded-l-lg lg:w-[50%] w-full`}
            >
              {children}
            </div>
            <div className="flex flex-col justify-center p-4 md:p-6 lg:p-8 w-full lg:w-[50%]">
              <div className="mb-2">
                <label htmlFor="">Document Type</label>
                <div className="mb-4 mt-2">
                  <select
                    name=""
                    id=""
                    value={documentTypeSelected}
                    className={`w-full p-2 shadow-[5px_5px_15px_5px_rgba(0,0,0,0.3)] border-[1px] border-color-${theme} rounded-lg bg-color-textfield-${theme} text-white placeholder-gray-300`}
                    onChange={(event) => handleChangeDocumentType(event)}
                  >
                    <option value hidden>
                      Select Document Type
                    </option>
                    {documentTypes[0] !== null &&
                      documentTypes.map((item) => {
                        return (
                          <option key={item.id} value={item.id}>
                            {item.name}
                          </option>
                        );
                      })}
                  </select>
                </div>
              </div>

              <div className="mb-2">
                <label htmlFor="">Document Number</label>
                <div className="mb-4 mt-2">
                  <input
                    type="text"
                    placeholder="Document Number"
                    className={`w-full p-2 shadow-[5px_5px_15px_5px_rgba(0,0,0,0.3)] border-[1px] border-color-${theme} rounded-lg bg-color-textfield-${theme} text-white placeholder-gray-300`}
                    value={documentNumber}
                    onChange={(e) => setDocumentNumber(e.target.value)}
                  />
                </div>
              </div>

              <div className="mb-2">
                <label htmlFor="issueDate">Issue Date</label>
                <div className={`mb-4 mt-2 `}>
                  <input
                    type="date"
                    id="issueDate"
                    placeholder="Issue Date (DD/MM/YYYY)"
                    className={`w-full p-2 shadow-[5px_5px_15px_5px_rgba(0,0,0,0.3)] border-[1px] border-color-${theme} rounded-lg bg-color-textfield-${theme} text-white ${getInputBorderColor(
                      requiredDocumentSelected?.has_issued_date
                    )}`}
                    value={issueDate}
                    disabled={!documentTypeSelected}
                    onChange={(e) => {
                      setIssueDate(e.target.value);
                      console.log("Issue Date:", e.target.value); // Log the issue date
                    }}
                  />
                </div>
              </div>

              <div className="mb-2">
                <label htmlFor="expiryDate">Expiry Date</label>
                <div className="mb-4 mt-2">
                  <input
                    type="date"
                    id="expiryDate"
                    placeholder="Expiry Date (DD/MM/YYYY)"
                    className={`w-full p-2 shadow-[5px_5px_15px_5px_rgba(0,0,0,0.3)] border-[1px] border-color-${theme} rounded-lg bg-color-textfield-${theme} text-white ${getInputBorderColor(
                      requiredDocumentSelected?.has_expiry_date
                    )}`}
                    value={expiryDate}
                    disabled={!documentTypeSelected}
                    onChange={(e) => setExpiryDate(e.target.value)}
                  />
                </div>
              </div>
              <button
                onClick={handleUpload}
                className={`bg-color-button-${theme} w-[180px] py-2 px-2 mt-6 rounded-2xl text-white ${
                  isUploadDisabled() ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={isUploadDisabled()}
              >
                Upload Document
              </button>

              {errorMessage && (
                <p className="text-red-500 text-sm mt-4">{errorMessage}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
