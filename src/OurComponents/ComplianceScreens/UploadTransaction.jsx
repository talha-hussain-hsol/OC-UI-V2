import React from 'react';
import Button from "../Reusable Components/Button";
import { useTheme } from "../../contexts/themeContext";
import { TbAlertTriangle } from "react-icons/tb";


const UploadTransaction = () => {

    const { theme } = useTheme();
    console.log("theme", theme);

  return (
    <>
      <div className="flex flex-col lg:flex-row lg:space-x-8 mt-8 lg:mt-[74px] justify-center px-4">
      
      {/* Upload Section */}
      <div className={`bg-color-stepper-card-${theme} p-6 rounded-lg w-full lg:w-[40%] shadow-[5px_5px_15px_5px_rgba(0,0,0,0.3)] mb-8 lg:mb-0`}>
        <p className={`text-color-${theme} text-base mb-4 font-light`}>Upload CSV</p>
        <hr className=" w-full border-t-[1px] border-t-[#6e84a3] opacity-25 mb-3 " />
        <div className="flex justify-center items-center mb-2 mt-10 h-44 border border-slate-800 hover:border-dashed hover:border-slate-500 rounded-lg bg-[#000040]">
        <p className="text-center lg:text-sm mt-10 mb-7 text-slate-500 text-xs">
          Drop files here to upload
        </p>
        </div>
      </div>

      {/* Instructions Section */}
      <div className={`bg-color-stepper-card-${theme} p-6 rounded-lg w-full lg:w-[40%] shadow-[5px_5px_15px_5px_rgba(0,0,0,0.3)]`}>
        <p className={`text-color-${theme} text-base font-light mb-4`}>Instructions</p>
        <hr className=" w-full border-t-[1px] border-t-[#6e84a3] opacity-25 mb-3 " />
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