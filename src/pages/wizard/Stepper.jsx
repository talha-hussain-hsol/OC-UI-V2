import React, { useState, useEffect } from "react";
import SideBar from "../../components/sidebar/Sidebar";
import Button from "../../components/ui/button/Button";
import UserType from "./account-wizard/UserType";
import UserForm from "./account-wizard/UserForm";
import Documents from "./account-wizard/Documents";
import FaceVerification from "./account-wizard/FaceVerification";
import VCIP from "./account-wizard/VCIP";
import Application from "./account-wizard/Application";
import BankWallets from "./account-wizard/BankWallets";
import Summary from "./account-wizard/Summary";
import { useTheme } from "../../contexts/themeContext";
import { getIdentityList } from "../../api/userApi";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import Loader from "../../components/ui/loader";

const initialSteps = ["Select Account", "Identity Setup", "Summary"];

function Stepper() {
  const { theme } = useTheme();
  const [currentStep, setCurrentStep] = useState(1);
  const [userType, setUserType] = useState("");
  const [formData, setFormData] = useState({});
  const location = useLocation();
  const params = useParams();
  const [fundData, setFundData] = useState(location.state?.fundData || null);                                 // will use this in future
  const [fundFields, setFundFields] = useState(location.state?.fundField || null);                            // will use this in future
  const [fundSetting, setFundSetting] = useState(location.state?.fundSetting || null);                        // will use this in future
  const [referenceDocuments, setreferenceDocuments] = useState(location.state?.referenceDocuments || null);   // will use this in future
  const [isLoader, setIsLoader] = useState(false);
  const [steps, setSteps] = useState(initialSteps);                                                           // Initialize with 3 steps
  const isShowFaceVerificationVCIP = true;
  const identitiesData = [];
  const cancelTokenSource = axios.CancelToken.source();
  
  
  console.log("paramzzzz", params);

  useEffect(() => {
    if (fundData && fundFields && fundSetting) {

      handleDynamicSteps(); // Dynamically load steps based on fundData
    }
  }, [fundData]);

  const handleDynamicSteps = async () => {
    setIsLoader(true);
    const identitiesData = await getIdentityList(cancelTokenSource.token, fundData?.id);
    setIsLoader(false);
    console.log("Fund Id Response:", identitiesData);
    console.log("Fund Data is here:", fundData);
    

    let stepsData = [
      { title: 'Select Account' },
      { title: 'Identity Setup' },
    ];

    const fundAccountSettings = fundData?.fund_setting?.account?.applicant?.identity;
    const fundApplicationStatus = fundData?.fund_setting?.account?.subscription;
 
    // Add Documents step as the third step
    stepsData.push({ title: 'Documents' });

    if (fundData?.isIndividual === undefined) {
      // Handle undefined case
      if (fundAccountSettings?.indivisual?.provider?.verify?.face?.enabled && isShowFaceVerificationVCIP) {
        stepsData.push({ title: 'Face Verification' });
      }
      if (fundAccountSettings?.indivisual?.provider?.verify?.vcip?.enabled && isShowFaceVerificationVCIP) {
        stepsData.push({ title: 'VCIP' });
      }
    } else {
      // Check if the account type is individual or corporate
      let customerType = fundData?.isIndividual ? 'indivisual' : 'corporate';

      if (fundAccountSettings?.[customerType]?.provider?.verify?.face?.enabled && isShowFaceVerificationVCIP) {
        stepsData.push({ title: 'Face Verification' });
      }
      if (fundAccountSettings?.[customerType]?.provider?.verify?.vcip?.enabled && isShowFaceVerificationVCIP) {
        stepsData.push({ title: 'VCIP' });
      }
    }


    if (
      (fundAccountSettings?.bank?.enabled || fundAccountSettings?.wallet?.enabled) &&
      fundData?.fund_data?.named_id?.toUpperCase() !== 'AXSA-WM'
    ) {
      stepsData.push({ title: 'Bank/Wallets' });
    }

    // Add Application as the second-last step before Summary
    if (fundApplicationStatus?.status) {
      stepsData.push({ title: 'Application' });
    }

    stepsData.push({ title: 'Summary' });

    // Update the steps
    setSteps(stepsData.map(step => step.title));
  };

  const handleNext = (data) => {
    if (data) {
      setFormData((prevData) => ({ ...prevData, ...data }));
    }
    if (currentStep < steps.length) {
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
    const stepComponents = {
      "Select Account": <UserType onSelection={handleUserTypeSelection} fundData={fundData} referenceDocuments={referenceDocuments} fundFields={fundFields} identitiesData={identitiesData}/>,
      "Identity Setup": <UserForm userType={userType} fundData={fundData} fundFields={fundFields} identitiesData={identitiesData} onNext={(formValues) => handleNext(formValues)} />,
      "Documents": <Documents />,
      "Face Verification": <FaceVerification />,
      "VCIP": <VCIP />,
      "Bank/Wallets": <BankWallets fundData={fundData}/>,
      "Application": <Application />,
      "Summary": <Summary />
    };

    const currentStepName = steps[currentStep - 1]; // Get the name of the current step
    return stepComponents[currentStepName] || null; // Render the corresponding component
  };

  return (
    <>
      <SideBar portalType="Customer" />
      <div className={`bg-color-${theme} w-full px-4 py-4 sm:px-6 md:px-16 lg:px-24 md:py-5 lg:py-6 min-h-screen`}>
        <ul className="relative flex flex-row gap-x-0 ml-14 mt-7">
          {steps.map((step, index) => (
            <li key={index} className={`shrink basis-0 flex-1 group ${index + 1 < currentStep ? "complete" : ""}`}>
              <div className="min-w-10 min-h-10 w-full inline-flex items-center text-xs align-middle">
                <div className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex justify-center items-center shrink-0 rounded-full text-lg ml-2 sm:ml-4 md:ml-5 ${index + 1 === currentStep ? "bg-blue-500 text-white" : index + 1 < currentStep ? "bg-[#008000] text-gray-200" : "bg-gray-400 text-gray-800"}`}>
                  {index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div className={`ms-1 w-full sm:w-[150%] md:w-[200%] h-px flex-grow group-last:hidden ${index + 1 < currentStep ? "bg-[#008000]" : "bg-gray-400"}`}></div>
                )}
              </div>
              <div className="mt-2 xs:mt-3 xs:mr-[10px] sm:mt-3 sm:mr-[15px] md:mt-4 md:mr-[25px] lg:mt-3 mr-[78px] xl:mr-[62px] 2xl:mr-[120px] text-center">
                <span className={`block text-sm md:text-base lg:text-sm ${index + 1 === currentStep ? " text-blue-500" : index + 1 < currentStep ? " text-green-700" : " text-gray-500"}`}>
                  {step}
                </span>
              </div>
            </li>
          ))}
        </ul>

        <div className={`bg-gradient-stepper-card-${theme} w-full shadow-[5px_5px_15px_5px_rgba(0,0,0,0.3)] mx-auto p-10 md:ml-4 md:mt-12 rounded-lg text-white flex flex-col justify-center`}>
          {isLoader ? <Loader /> : renderContent()}
          <hr className="w-[95%] border-t-[1px] border-t-[#6e84a3] opacity-30 my-6 mx-8" />
          <div className="flex lg:space-x-[75%] md:justify-center sm:justify-center w-full p-4">
            <Button text="Back" className={`bg-color-button-${theme} py-6 px-8 mr-[5%] border b-white hover:border-0 rounded-lg text-white focus:outline-none`} onClick={handlePrev} disabled={currentStep === 1} />
            <Button text="Next" className={`bg-color-button-${theme} py-6 px-8 rounded-lg text-white`} onClick={() => handleNext(null)} disabled={currentStep === steps.length} />
          </div>
        </div>
      </div>
    </>
  );
}

export default Stepper;