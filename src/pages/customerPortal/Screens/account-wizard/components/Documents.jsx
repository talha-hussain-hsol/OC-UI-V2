import React, { useState } from "react";
import Button from "../../../../../components/ui/button/Button";
import Modal from "../../../../../components/modal/Modal";
import { useTheme } from "../../../../../contexts/themeContext";
import { getIdentityDocument } from "../../../../../api/userApi";

function Documents() {
  const [documentUploadedSelected, setDocumentUploadedSelected] = useState([]);
  const [identityUploadDocList, setIdentityUploadDocList] = useState([]);
  const [isLoader, setIsLoader] = useState(false);




  let { identity_id, account_id } = useParams();
  useEffect(() => {
    handleGetIdentityDocumentApi();
  }, [identity_id]);


  const { theme } = useTheme();

  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const documents = [
    "CERTIFICATE OF INCORPORATION",
    "UTILITY BILL",
    "CERTIFICATE OF SGX ONLINE EDUCATION",
    "PROOF OF ADDRESS",
    "FORM OF IDENTIFICATIONS",
    "PROOF OF ADDRESS",
    "OTHERS",
  ];

  function handleDocumentSelect(doc) {
    setSelectedDocument(doc);
    setIsModalOpen(true);
  }

  function handleCloseModal() {
    setIsModalOpen(false);
  }

  const handleGetIdentityDocumentApi = async () => {
    setIsLoader(true);

    const response = await getIdentityDocument(
      identity_id,
      cancelTokenSource.token,
    );
    if (response.success == true) {
      setIsLoader(false);
      setIdentityUploadDocList(response?.data?.IdentityDocuments);
    } else {
      setIsLoader(false);
    }
  };

  return (
    <>
      <div className="bg-transparent flex flex-col md:flex-row md:space-y-0 md:space-x-6">
        <div
          className={`bg-transparent mx-auto md:ml-16 mt-6 rounded-lg  p-6 w-full max-w-md h-[390px] overflow-y-auto custom-scrollbar`}
        >
          <div className="space-y-3">
            {documents.map((doc, index) => (
              <div
                key={index}
                className={`flex justify-between shadow-[5px_5px_15px_5px_rgba(0,0,0,0.3)] items-center p-[22px] rounded-lg cursor-pointer
                      ${
                        selectedDocument === doc
                          ? `border border-red-500`
                          : "border border-white"
                      }
                      hover:border-color-${theme} transition-colors`}
                onClick={() => handleDocumentSelect(doc)}
              >
                <span>{doc}</span>
                <button className="text-red-500">→</button>
              </div>
            ))}
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
          selectedType={selectedDocument}
        >
          <div
            className={` bg-transparent flex flex-col items-center justify-center w-full border-2 border-color-modal-${theme} rounded-lg p-8 md:p-16`}
          >
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

            <Button
              text="Browse Files"
              className="lg:w-full py-[14px] md:py-[18px] md:w-[40%] px-3 rounded-[18px] text-center flex justify-center items-center border text-white border-green-700 mb-4 sm:w-[40%] xs:w-[40%]"
            />
            <Button
              text="Capture Image"
              className="lg:w-full py-[14px] md:py-[18px] md:w-[40%] px-3 rounded-[18px] text-center flex justify-center items-center border text-white border-orange-700 sm:w-[40%] xs:w-[40%]"
            />

            <p className="text-sm text-gray-300 mt-4 whitespace-nowrap">
              Max file size: 5MB
            </p>
            <p className="text-sm text-gray-300 whitespace-nowrap">
              Supported file types: PNG, JPG, PDF, DOCS
            </p>
          </div>
        </Modal>
      )}
    </>
  );
}

export default Documents;
