import React, { useRef, useState } from "react";
import { IoCameraOutline } from "react-icons/io5";
import { useTheme } from "../../contexts/themeContext";
import Loader from "../ui/loader";

const UploadDocument = ({ onClose, handleSubmit, isLoading }) => {
  const { theme } = useTheme();
  const fileInputRef = useRef(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (
      file &&
      file.type === "application/pdf" &&
      file.size <= 75 * 1024 * 1024
    ) {
      setSelectedFile(file);
      setErrorMessage("");
    } else {
      setErrorMessage("Only PDF files up to 75 MB are allowed.");
    }
  };

  const openFileDialog = () => {
    fileInputRef.current && fileInputRef.current.click();
  };

  return (
    <>
      <div
        className={`shadow-${theme} bg-gradient-to-b from-[#0d345d] to-[#141d3b] mt-6 p-4 rounded-md w-1/2 `}
      >
        <div
          className="border-2 border-dotted border-white px-4 py-20 mb-10 cursor-pointer"
          onClick={openFileDialog}
        >
          <div className="flex flex-col items-center mb-10 gap-4">
            {selectedFile ? (
              <p className="text-white font-semibold text-lg mt-4">
                {selectedFile.name}
              </p>
            ) : (
              <>
                <IoCameraOutline size={40} color="white" />
                <p className="text-white font-semibold text-lg mt-4">
                  Upload Document
                </p>
                <p className="text-white text-sm">Formats PDF only</p>
                <p className="text-white text-sm">Max size 75 MB</p>
              </>
            )}
          </div>
        </div>
        <input
          type="file"
          accept=".pdf"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileUpload}
        />
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        <div className="flex justify-between gap-6">
          {isLoading && <Loader theme={theme} />}
          <button
            onClick={handleSubmit}
            className="px-6 py-3 text-white bg-[#2c7be5] rounded-md hover:bg-[#2569c3] transition-all duration-300 ease-in-out"
          >
            Upload
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 text-white bg-[#2c7be5] rounded-md hover:bg-[#2569c3] transition-all duration-300 ease-in-out"
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  );
};

export default UploadDocument;
