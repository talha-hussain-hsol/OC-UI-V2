import React from "react";
import Button from "../Reusable Components/Button";
import SideBar from "../Reusable Components/SideBar";
import { useTheme } from "../../contexts/themeContext";

function VCIP() {
  const { theme } = useTheme();
  console.log("theme", theme);
  return (
    <>
      <div className={`mt-2 border-b-4 border-color-${theme} px-4 `}>
        <h1 className="text-xl lg:text-[1.625rem] mb-2">
          VCIP - Video Based Customer Identification Process
        </h1>
      </div>
      <div className="flex flex-col lg:flex-row lg:space-x-8 mt-8 lg:mt-[74px] justify-center px-4 ">
        <div className={`bg-color-stepper-card-${theme} p-6 shadow-[5px_5px_15px_5px_rgba(0,0,0,0.3)] rounded-lg w-full lg:w-[70%]   mb-8 lg:mb-0`}>
          <h3 className="text-lg p-4 rounded-md mb-4  shadow-[5px_5px_15px_5px_rgba(0,0,0,0.3)]">
            Welcome to the VCIP Step.
          </h3>
          <p className="text-sm lg:text-[16px] mt-10">
            To proceed with the VCIP verification when the video recording
            begins:
          </p>
          <ol className="ml-6 list-decimal list-inside space-y-2">
            <li>
              Please say out your full name as per your National ID/Passport
              clearly.
            </li>
            <li>Please say out your Birth Date.</li>
            <li>
              Please show us your National ID/Passport, please ensure it's
              clearly visible.
            </li>
          </ol>
          <p className="text-sm lg:text-[16px] mt-6">
            Please click on the [Start Recording] button when you are ready.
          </p>
        </div>
        <div className={`bg-color-stepper-card-${theme} p-6 rounded-lg w-full lg:w-[34%]   shadow-[5px_5px_15px_5px_rgba(0,0,0,0.3)]`}>
          <p className="text-sm lg:text-[16px] p-4 mb-4">
            For personal privacy purposes, the video recorded will be blurred.
          </p>
          <div className="flex justify-center items-center mb-4 mt-8">
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
          <p className="text-center text-sm lg:text-lg mt-10">
            Position your face in the designated area.
          </p>
          <Button
            text="Start Recording"
            className={`bg-color-button-${theme} hover:bg-green-600 text-white py-4 lg:py-[20px] px-4 lg:px-8 rounded-[18px] mx-auto block mt-10 lg:mt-24`}
          />
        </div>
      </div>
    </>
  );
}

export default VCIP;
