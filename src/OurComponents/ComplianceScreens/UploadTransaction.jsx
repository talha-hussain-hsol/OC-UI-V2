import React from 'react';
import Button from "../Reusable Components/Button";
import { useTheme } from "../../contexts/themeContext";
import { TbAlertTriangle } from "react-icons/tb";


const UploadTransaction = () => {

    const { theme } = useTheme();
    console.log("theme", theme);

  return (
    <>
      {/* <div className="flex flex-col lg:flex-row lg:space-x-8 mt-8 lg:mt-[74px] justify-center px-4">
        <div className={`bg-color-stepper-card-${theme} p-6  rounded-lg w-full lg:w-[40%] shadow-[5px_5px_15px_5px_rgba(0,0,0,0.3)] mb-8 lg:mb-0`}>
            <p className={`text-color-${theme}`}>Upload CSV</p>
          <div className="flex justify-center items-center mb-4 mt-10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-24 w-24 text-sky-500"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M12 2a6 6 0 00-6 6v1H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2v-6a2 2 0 00-2-2h-2V8a6 6 0 00-6-6zm-1 11a1 1 0 112 0v2a1 1 0 11-2 0v-2zm1-5a3 3 0 00-2.83 2H10a1 1 0 000 2h4a1 1 0 000-2h-.17A3 3 0 0012 8z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <p className="text-center text-sm lg:text-lg mt-10 uppercase">
            Position your face within the designated area.
          </p>
          <Button
            text="Proceed"
            className={`bg-color-stepper-proceedbutton-${theme} hover:bg-red-600 text-white py-4 lg:py-[20px] px-4 rounded-lg mx-auto block mt-10`}
          />
        </div>

        
        <div className={`bg-color-stepper-card-${theme}  p-6 rounded-lg w-full lg:w-[40%] shadow-[5px_5px_15px_5px_rgba(0,0,0,0.3)]`}>
          <p className={`text-color-${theme}`}>Instructions</p>
          <div className="flex justify-center items-center mb-4 mt-10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-24 w-24 text-sky-500"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M2 8a6 6 0 016-6h8a6 6 0 016 6v8a6 6 0 01-6 6H8a6 6 0 01-6-6V8zm12 7a1 1 0 112 0v2a1 1 0 11-2 0v-2zm-1-5a3 3 0 00-2.83 2H10a1 1 0 000 2h4a1 1 0 000-2h-.17A3 3 0 0012 10z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <p className="text-center text-sm lg:text-lg mt-10 uppercase">
            Position the front of your National ID / Passport within the frame.
          </p>
          <Button
            text="Proceed"
            className={`bg-color-stepper-proceedbutton-${theme} hover:bg-red-600 text-white py-4 lg:py-[20px] px-4 rounded-lg mx-auto block mt-10`}
          />
        </div>
      </div> */}
      <div className="flex flex-col lg:flex-row lg:space-x-8 mt-8 lg:mt-[74px] justify-center px-4">
      
      {/* Upload Section */}
      <div className={`bg-color-stepper-card-${theme} p-6 rounded-lg w-full lg:w-[40%] shadow-[5px_5px_15px_5px_rgba(0,0,0,0.3)] mb-8 lg:mb-0`}>
        <p className={`text-color-${theme} text-lg font-semibold mb-4`}>Upload CSV</p>
        <div className="flex justify-center items-center mb-4 mt-10 h-40 border border-dashed border-slate-500 rounded-lg">
        <p className="text-center text-sm lg:text-lg mt-10 uppercase">
          Drop files here to upload
        </p>
        </div>
      </div>

      {/* Instructions Section */}
      <div className={`bg-color-stepper-card-${theme} p-6 rounded-lg w-full lg:w-[40%] shadow-[5px_5px_15px_5px_rgba(0,0,0,0.3)]`}>
        <p className={`text-color-${theme} text-lg font-semibold mb-4`}>Instructions</p>
        <ul className="list-disc text-xs text-slate-400 space-y-2 mb-4 ml-2">
          <li>The file must be in CSV format.</li>
          <li>Only one file can be uploaded at a time.</li>
          <li>The file can only contain alphanumeric characters.</li>
          <li>The file should not contain any special characters or symbols.</li>
          <li>TrxType must be one of subscription, addition, redemption, pay, receive, internal, exchange, and deposit.</li>
          <li>Currency must be one of SGD, USD, or GBP.</li>
        </ul>
        <div className="flex">
          <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-light">
            Download Sample File
          </button>
          <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg ml-2 font-light">
            Instructions
          </button>
        </div>
        <div className={` flex bg-color-stepper-card-${theme} p-2 mt-4 rounded-lg w-full lg:w-[100%] shadow-[5px_5px_15px_5px_rgba(0,0,0,0.3)]`}>
            <div>
            <TbAlertTriangle className='text-yellow-500 text-2xl mt-4' />
            </div>
            <p className={`text-yellow-500 text-xs font-light my-2 ml-4`}>
            Please do not leave this page or navigate away until all accounts have been successfully uploaded. Leaving the page prematurely may result in incomplete account uploads.</p>
        </div>
      </div>
    </div>

    </>
  )
}

export default UploadTransaction