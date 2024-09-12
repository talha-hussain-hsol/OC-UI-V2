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
import { useTheme } from "../../contexts/themeContext";

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
  const { theme } = useTheme();
  const [currentStep, setCurrentStep] = useState(1);
  const [userType, setUserType] = useState(""); // Store the selected userType
  const [formData, setFormData] = useState({}); // Store all form data

  const handleNext = (data) => {
    if (currentStep === steps.length) {
      setComplete(true);
    } else {
      if (data) {
        setFormData((prevData) => ({ ...prevData, ...data })); // Save form data
      }
      setCurrentStep((prev) => prev + 1); // Advance step
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleUserTypeSelection = (type) => {
    setUserType(type); // Store the selected user type in state
    handleNext(); // Move to the next step
  };

  const renderContent = () => {
    switch (currentStep) {
      case 1:
        return <UserType onSelection={handleUserTypeSelection} />; // Pass the user type selection handler
      case 2:
        return (
          <UserForm
            userType={userType} // Pass the selected user type
            onNext={(formValues) => handleNext(formValues)} // Handle form submission
          />
        );
      case 3:
        return <Documents />;
      case 4:
        return <FaceVerification />;
      case 5:
        return <VCIP />;
      case 6:
        return <BankWallets />;
      case 7:
        return <Application />;
      case 8:
        return <Summary />;
      default:
        return null;
    }
  };

  return (
    <>
      <SideBar portalType="Customer" />
      <div
        className={`bg-color-${theme} w-full px-4 py-4 sm:px-6 md:px-16 lg:px-24 md:py-5 lg:py-6 `}
      >
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
                      : index + 1 < currentStep
                      ? "bg-[#008000] text-gray-200"
                      : "bg-gray-400 text-gray-800"
                  }`}
                >
                  {index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`ms-1 w-full sm:w-[150%] md:w-[200%] h-px flex-grow group-last:hidden ${
                      index + 1 < currentStep ? "bg-[#008000]" : "bg-gray-400"
                    }`}
                  ></div>
                )}
              </div>
              <div className="mt-2  xs:mt-3 xs:mr-[10px] sm:mt-3 sm:mr-[15px] md:mt-4 md:mr-[25px] lg:mt-3 mr-[78px] xl:mr-[62px]  2xl:mr-[120px] text-center">
                <span
                  className={`block text-sm md:text-base lg:text-sm  ${
                    index + 1 === currentStep
                      ? " text-blue-500"
                      : index + 1 < currentStep
                      ? " text-green-700"
                      : " text-gray-500"
                  }`}
                >
                  {step}
                </span>
              </div>
            </li>
          ))}
        </ul>

        <div
          className={`bg-gradient-stepper-card-${theme} w-full shadow-[5px_5px_15px_5px_rgba(0,0,0,0.3)] mx-auto p-10 md:ml-4 md:mt-12 rounded-lg text-white flex flex-col justify-center`}
        >
          {renderContent()}

          <hr className="w-[95%] border-t-[1px] border-t-[#6e84a3] opacity-30 my-6 mx-8" />
          <div className="flex lg:space-x-[75%] md:justify-center sm:justify-center w-full p-4">
            <Button
              text="Back"
              className={`bg-color-button-{theme} py-6 px-8 mr-[5%] border b-white hover:border-0 rounded-lg text-white focus:outline-none`}
              onClick={handlePrev}
              disabled={currentStep === 1}
            />
            <Button
              text="Next"
              className={`bg-color-button-${theme} py-6 px-8 rounded-lg text-white`}
              onClick={() => handleNext(null)}
              disabled={currentStep === steps.length}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Stepper;
