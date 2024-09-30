import React, { useState, useEffect } from "react";
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
  const [userType, setUserType] = useState("");
  const [formData, setFormData] = useState({});
  useEffect(() => {
    console.log("Current theme:", theme);

    document.body.style.backgroundColor =
      theme === "SC"
        ? "#ffffff"
        : theme === "Ascent"
        ? "rgba(18, 38, 63)"
        : theme === "lightTheme"
        ? "#000000"
        : "";

    return () => {
      document.body.style.backgroundColor = "";
    };
  }, [theme]);
  const handleNext = (data) => {
    if (currentStep === steps.length) {
      setComplete(true);
    } else {
      if (data) {
        setFormData((prevData) => ({ ...prevData, ...data }));
      }
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleUserTypeSelection = (type) => {
    setUserType(type);
    handleNext();
  };

  const renderContent = () => {
    switch (currentStep) {
      case 1:
        return <UserType onSelection={handleUserTypeSelection} />;
      case 2:
        return (
          <UserForm
            userType={userType}
            onNext={(formValues) => handleNext(formValues)}
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
        <ul className="relative flex flex-row  lg:ml-14 lg:mt-7 md:mt-16 md:ml-0 md:mr-2 sm:mt-16 sm:ml-0 xs:mt-16 xs:ml-4">
          {steps.map((step, index) => (
            <li
              key={index}
              className={` lg:flex-1 ${
                index + 1 < currentStep ? "complete" : ""
              }`}
            >
              <div className="min-w-10 min-h-10 w-full inline-flex items-center text-xs align-middle ">
                <div
                  className={`w-8 h-8 sm:w-6 sm:h-6 xs:w-5 xs:h-5  md:w-10 md:h-10 flex justify-center items-center shrink-0 rounded-full text-lg ml-2 sm:ml-4 md:ml-5 ${
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
                    className={`ms-1 lg:w-full  lg:h-[1px] lg:flex-grow  ${
                      index + 1 < currentStep ? "bg-[#008000]" : "bg-gray-400"
                    }`}
                  ></div>
                )}
              </div>
              <div className="mt-2  xs:mt-3 xs:mr-[10px] sm:mt-3 sm:mr-[15px] md:mt-4 md:mr-[25px] lg:mt-3 mr-[78px] xl:mr-[62px]  2xl:mr-[120px] text-center">
                <span
                  className={`block text-sm md:text-xs lg:text-sm xs:text-xs xs:text-wrap ${
                    index + 1 === currentStep
                      ? " text-blue-500"
                      : index + 1 < currentStep
                      ? " text-green-700"
                      : " text-gray-500"
                  } sm:block hidden ml-3`}
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
          <div className="flex justify-center lg:space-x-[75%]  sm:justify-between w-full p-4">
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
