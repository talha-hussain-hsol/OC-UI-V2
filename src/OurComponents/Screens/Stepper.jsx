import React, { useState } from "react";
import SideBar from "../Reusable Components/SideBar";
import Button from "../Reusable Components/Button";
import UserType from "./UserType";
import UserForm from "./UserForm";
import Documents from "./Documents";
import FaceVerification from "./FaceVerification";
import VCIP from "./VCIP";
import Application from "./Application";
import BankWallets from "./BankWallets";
import Summary from "./Summary";

const steps = [
  "Select Account",
  "Identity Setup",
  "Documents",
  "Face Verification",
  "VCIP",
  "Bank/Wallet",
  "Application",
  "Summary",
];

function Stepper() {
  const [currentStep, setCurrentStep] = useState(1);
  const [complete, setComplete] = useState(false);

  const handleNext = () => {
    if (currentStep === steps.length) {
      setComplete(true);
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      setComplete(false);
    }
  };

  const renderContent = () => {
    if (currentStep === 1) {
      return <UserType />;
    } else if (currentStep === 2) {
      return <UserForm />;
    } else if (currentStep === 3) {
      return <Documents />;
    } else if (currentStep === 4) {
      return <FaceVerification />;
    } else if (currentStep === 5) {
      return <VCIP />;
    } else if (currentStep === 6) {
      return <BankWallets />;
    } else if (currentStep === 7) {
      return <Application />;
    } else if (currentStep === 8) {
      return <Summary />;
    } else {
      return null;
    }
  };

  return (
    <>
      <SideBar portalType="Customer" />
      <div className="w-full px-4 py-4 sm:px-6 md:px-16 lg:px-24 md:py-5 lg:py-6 ">
        <ul className="relative flex flex-row gap-x-0 ml-14 mt-7 ">
          {steps.map((step, index) => (
            <li
              key={index}
              className={`shrink basis-0 flex-1 group ${
                index + 1 < currentStep ? "complete" : ""
              }`}
            >
              <div className="min-w-10 min-h-10 w-full inline-flex items-center text-xs align-middle ">
                <div
                  className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex justify-center items-center shrink-0 rounded-full text-lg ml-2 sm:ml-4 md:ml-5 ${
                    index + 1 === currentStep
                      ? "bg-blue-500 text-white"
                      : index + 1 < currentStep || complete
                      ? "bg-[#008000] text-gray-200"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`ms-1 w-full sm:w-[150%] md:w-[200%] h-px flex-grow group-last:hidden ${
                      index + 1 < currentStep || complete
                        ? "bg-[#008000]"
                        : "bg-gray-200"
                    }`}
                  ></div>
                )}
              </div>
              <div className="mt-2  xs:mt-3 xs:mr-[10px] sm:mt-3 sm:mr-[15px] md:mt-4 md:mr-[25px] lg:mt-3 mr-[78px] xl:mr-[62px]  2xl:mr-[120px] text-center">
                <span
                  className={`block text-sm md:text-base lg:text-sm  ${
                    index + 1 === currentStep
                      ? "text-white  "
                      : index + 1 < currentStep || complete
                      ? "text-gray-200"
                      : "text-gray-400"
                  }`}
                >
                  {step}
                </span>
              </div>
            </li>
          ))}
        </ul>

        <div className="bg-custom-gradient w-full md:w-full shadow-[5px_5px_15px_5px_rgba(0,0,0,0.3)] mx-auto p-10   md:ml-4 md:mt-12 rounded-lg  text-white  flex flex-col justify-center">
          {renderContent()}

          <hr className="w-[95%] border-t-[1px] border-t-[#6e84a3] opacity-30 my-6 mx-8 z-0" />
          <div className="flex lg:space-x-[75%] md:justify-center sm:justify-center w-full p-4 xs:justify-center z-10">
            <Button
              text="Back"
              className="bg-[#062b4d] py-6 px-8 mr-[5%] border b-white hover:border-0 rounded-lg text-white focus:outline-none"
              onClick={handlePrev}
              disabled={currentStep === 1}
            />
            <Button
              text="Next"
              className="bg-green-600 py-6 px-8 rounded-lg text-white"
              onClick={handleNext}
              disabled={complete}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Stepper;
