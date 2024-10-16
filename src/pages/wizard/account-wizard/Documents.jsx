import React, { useState, useEffect, useRef } from "react";
import Button from "../../../components/ui/button/Button";
import Modal from "../../../components/modal/Modal";
import { useTheme } from "../../../contexts/themeContext";
import useDocumentHook from "../../../hooks/useDocumentHook";
import Loader from "../../../components/ui/loader";
import { IoArrowForward } from "react-icons/io5";

function Documents(dataOfAccountSetups) {
  const {
    fetchAPIs,
    loading,
    requiredDoc,
    fetchIdentityDocuments,
    fetchAccountDetails,
    accountDetails,
    identityDocument,
  } = useDocumentHook();
  const [errorMessage, setErrorMessage] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [selectedFile, setSelectedFile] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [identityUploadDocList, setIdentityUploadDocList] = useState({});
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [isItemSelected, setIsItemSelected] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [requiredDocumentSelected, setRequiredDocumentSelected] =
    useState(null);
  const [selectedIndex, setSelectedIndex] = useState(false);
  const [documentUploadedSelected, setDocumentUploadedSelected] = useState([]);
  const fileInputRef = useRef(null);
  const [accountDetailState, setAccountDetails] = useState(accountDetails);
  const [identityDocumentState, setIdentityDocuments] =
    useState(identityDocument);
  const [issueDate, setIssueDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");

  useEffect(() => {
    fetchAPIs();
    console.log("dataOfAccountSetups33", dataOfAccountSetups);
  }, []);

  const { theme } = useTheme();

  useEffect(() => {
    const filteredDocs = requiredDoc
      .filter(
        (doc) =>
          doc.category_key === "DOCUMENT" && doc.key !== "FACE_VERIFICATION"
      )
      .sort((a, b) => {
        if (a.key === "OTHER" && b.key !== "OTHER") {
          return 1;
        }
        if (a.key !== "OTHER" && b.key === "OTHER") {
          return -1;
        }
        return 0;
      });

    setFilteredDocuments(filteredDocs);
  }, [requiredDoc]);

  const getUploadedDocumentChildName = (doc) => {
    const dataforChildName = identityUploadDocList[doc?.id];

    if (dataforChildName) {
      if (dataforChildName.length > 0) {
        const childSubDocId = dataforChildName.map(
          (ids) => ids.subDocumentTypeId
        );
        const uniqueChildSubDocId = [...new Set(childSubDocId)];

        let children = uniqueChildSubDocId
          .map((id) => {
            let documentMeta = identityUploadDocList[doc?.id];
            const filteredObjects = documentMeta.filter(
              (obj) => obj.subDocumentTypeId === id
            );
            const origins = filteredObjects.map((obj) => obj.meta.origin);
            let item = doc.children.find((c) => c.id === id);
            if (item) {
              item["origin"] = origins;
              return item;
            }
            return null;
          })
          .filter((c) => c);

        if (children.length > 0) {
          return children;
        } else {
          return null;
        }
      } else {
        return null;
      }
    } else {
      return null;
    }
  };

  const handleDocumentSelect = (document, index) => {
    if (typeof document === "object") {
      setIsItemSelected(true);
      let selectedFromUploadDocument = identityUploadDocList[document?.id];
      if (selectedFromUploadDocument !== undefined) {
        setDocumentUploadedSelected(selectedFromUploadDocument);
      } else {
        setDocumentUploadedSelected([]);
      }

      setRequiredDocumentSelected(document);
    } else {
      setIsItemSelected(true);
      let selectedFromUploadDocument = identityUploadDocList[document];
      if (selectedFromUploadDocument !== undefined) {
        setDocumentUploadedSelected(selectedFromUploadDocument);
      } else {
        setDocumentUploadedSelected([]);
      }
      setRequiredDocumentSelected(selectedFromUploadDocument[0]);
    }
    setSelectedIndex(index);
    if (!getUploadedDocumentChildName(document)) {
      setIsModalOpen(true);
    }
  };

  function handleCloseModal() {
    setIsModalOpen(false);
    setSelectedDocument([]);
    setImagePreview(null);
  }

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (file) {
      if (allowedTypes.includes(file.type) && file.size <= 5 * 1024 * 1024) {
        setUploadedFiles((prev) => ({
          ...prev,
          [requiredDocumentSelected.key]: file,
        }));
        setSelectedFile(file);
        if (file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setImagePreview(reader.result);
          };
          reader.readAsDataURL(file);
        } else {
          setImagePreview(null);
        }
        setErrorMessage("");
      } else if (file.size > 5 * 1024 * 1024) {
        setErrorMessage("File size exceeds the limit of 5 MB.");
      } else if (!allowedTypes.includes(file.type)) {
        setErrorMessage(
          "Invalid file type. Only PNG, JPG, PDF, and DOC/DOCX files are allowed."
        );
      }
    }
  };

  const openFileDialog = () => {
    fileInputRef.current && fileInputRef.current.click();
  };

  const getUploadedIdentityDocData = (id) => {
    const keysOfIdentityDocumentData = identityUploadDocList[id];
    if (keysOfIdentityDocumentData) {
      return keysOfIdentityDocumentData[0];
    }
  };

  return (
    <>
      {loading ? (
        <Loader theme={theme} />
      ) : (
        <>
          <div
            className={`bg-transparent flex flex-col md:flex-row md:space-y-0 py-10 rounded-lg mx-20 md:space-x-6 shadow-${theme}`}
          >
            <div
              className={`bg-transparent mx-auto rounded-lg px-6 py-2 w-full max-w-md h-[420px] overflow-y-scroll `}
            >
              <div className="space-y-4">
                {filteredDocuments.map((doc, index) => {
                  return (
                    <div
                      key={index}
                      className={`flex flex-col gap-4 bg-gradient-card-${theme} shadow-[5px_5px_15px_5px_rgba(0,0,0,0.3)] p-[22px] rounded-lg cursor-pointer
                      ${
                        uploadedFiles[doc.key]
                          ? `border-2 border-green-500`
                          : doc.isRequired
                          ? "border-2 border-[#ff0000]"
                          : "border-2 border-none"
                      }
                       `}
                      onClick={() => handleDocumentSelect(doc)}
                    >
                      <div className="flex justify-between items-center">
                        <span>{doc.name}</span>
                        <button
                          className={`rounded-full p-1 ${
                            uploadedFiles[doc.key]
                              ? `bg-green-500`
                              : `bg-[#ff0000]`
                          }`}
                        >
                          <IoArrowForward size={14} color="black" />
                        </button>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <p>Issue Date: {uploadedFiles.issueDate}</p>
                        <p>Expiry Date: {uploadedFiles.expiryDate}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col items-center justify-center w-full h-64 md:mx-4 mt-10 text-white">
              <div className="flex flex-col items-center justify-center space-y-4">
                <div
                  className={`flex flex-col items-center justify-center border-2 border-color-${theme} rounded-lg py-6 px-8 w-full`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-sky-500"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2a6 6 0 00-6 6v1H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2v-6a2 2 0 00-2-2h-2V8a6 6 0 00-6-6zm-1 11a1 1 0 112 0v2a1 1 0 11-2 0v-2zm1-5a3 3 0 00-2.83 2H10a1 1 0 000 2h4a1 1 0 000-2h-.17A3 3 0 0012 8z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-md">
                    Max file size: <span>5MB</span>
                  </p>
                  <p className="text-sm">
                    Supported file types: <span>PNG, JPG, PDF, DOCS</span>
                  </p>
                </div>
                <p className="text-center text-sm mt-4">
                  There is no document uploaded as yet.
                </p>
              </div>
            </div>
          </div>

          {isModalOpen && (
            <Modal
              id="upload-modal"
              title="Upload New Document"
              onClose={handleCloseModal}
              selectedFile={selectedFile}
              identity_id={
                dataOfAccountSetups.dataOfAccountSetups[0]?.data?.identity
                  ?.identity_id
              }
              requiredDocumentSelected={requiredDocumentSelected}
              fetchAccountDetails={fetchAccountDetails}
              fetchIdentityDocuments={fetchIdentityDocuments}
              identityDocument={identityDocument}
              setIdentityDocument={setIdentityDocuments}
              accountDetails={accountDetails}
              setAccountDetails={setAccountDetails}
              expiryDate={expiryDate}
              setExpiryDate={setExpiryDate}
              issueDate={issueDate}
              setIssueDate={setIssueDate}
            >
              <div
                className={` bg-transparent flex flex-col items-center justify-center w-full border-4 border-color-modal-${theme} rounded-lg p-8 md:p-16`}
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Uploaded Preview"
                    className="h-32 w-32 object-cover rounded-lg mb-4"
                  />
                ) : (
                  <>
                    <div className="flex flex-col items-center justify-center rounded-lg py-6 w-[80%]">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-12 w-12 text-sky-500"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12 2a6 6 0 00-6 6v1H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2v-6a2 2 0 00-2-2h-2V8a6 6 0 00-6-6zm-1 11a1 1 0 112 0v2a1 1 0 11-2 0v-2zm1-5a3 3 0 00-2.83 2H10a1 1 0 000 2h4a1 1 0 000-2h-.17A3 3 0 0012 8z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <p className="text-md text-nowrap">
                        Please click on 'Browse File' to upload.
                      </p>
                    </div>

                    <>
                      <Button
                        onClick={openFileDialog}
                        text="Browse Files"
                        className="lg:w-full py-[14px] md:py-[18px] md:w-[40%] px-3 rounded-[18px] text-center flex justify-center items-center border-2 text-white border-green-700 mb-2 sm:w-[40%] xs:w-[40%]"
                      />
                      <Button
                        text="Capture Image"
                        className="lg:w-full py-[14px] md:py-[18px] md:w-[40%] px-3 rounded-[18px] text-center flex justify-center items-center border-2 text-white border-orange-700 sm:w-[40%] xs:w-[40%]"
                      />
                      {errorMessage && (
                        <p className="text-red-500 text-xs mb-4">
                          {errorMessage}
                        </p>
                      )}
                    </>

                    <p className="text-sm text-gray-300 mt-4 whitespace-nowrap">
                      Max file size: 5MB
                    </p>
                    <p className="text-sm text-gray-300 whitespace-nowrap">
                      Supported file types: PNG, JPG, PDF, DOCS
                    </p>
                  </>
                )}
              </div>
            </Modal>
          )}
          <input
            type="file"
            accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileUpload}
          />
        </>
      )}
    </>
  );
}

export default Documents;
