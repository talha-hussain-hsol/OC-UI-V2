import React from "react";
import Button from "../Reusable Components/Button";
import { useTheme } from "../../contexts/themeContext";

function FaceVerification() {
  const { theme } = useTheme();
  console.log("theme", theme);
  return (
    <>
      <div className={`mt-2 border-b-4 border-color-${theme} px-2 `}>
        <h1 className="text-xl lg:text-2xl mb-2">Liveliness Test</h1>
        <p className="text-sm lg:text-md mb-6 mt-4 uppercase">
          To meet the regulatory KYC and AML/CFT requirements, this step helps
          us to ensure that you are who you say you are.
        </p>
      </div>
      <div className="flex flex-col lg:flex-row lg:space-x-8 mt-8 lg:mt-[74px] justify-center px-4">
        <div className={`bg-color-stepper-card-${theme} p-6  rounded-lg w-full lg:w-[40%] shadow-[5px_5px_15px_5px_rgba(0,0,0,0.3)] mb-8 lg:mb-0`}>
          <h2 className={`bg-color-stepper-card-${theme} text-lg p-4 rounded-md mb-4 text-center shadow-[5px_5px_15px_5px_rgba(0,0,0,0.3)] uppercase`}>
            Face Snap
          </h2>
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
          <h2 className="text-lg p-4 rounded-md mb-4 text-center shadow-[5px_5px_15px_5px_rgba(0,0,0,0.3)] uppercase">
            National ID / Passport with Photo
          </h2>
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
      </div>
    </>
  );
}

export default FaceVerification;
