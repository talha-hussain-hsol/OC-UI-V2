// import React, { useState, useEffect } from "react";
// import SideBar from "../../components/sidebar/Sidebar";
// import Button from "../../components/ui/button/Button";
// import UserType from "./account-wizard/UserType";
// import UserForm from "./account-wizard/UserForm";
// import Documents from "./account-wizard/Documents";
// import FaceVerification from "./account-wizard/FaceVerification";
// import VCIP from "./account-wizard/VCIP";
// import Application from "./account-wizard/Application";
// import BankWallets from "./account-wizard/BankWallets";
// import Summary from "./account-wizard/Summary";
// import { useTheme } from "../../contexts/themeContext";
// import { getIdentityList, getSingleAccountDetailByIdAPI } from "../../api/userApi";
// import { useLocation, useParams } from "react-router-dom";
// import axios from "axios";
// import Loader from "../../components/ui/loader";

// const initialSteps = ["Select Account", "Identity Setup", "Summary"];

// function Stepper() {
//   const { theme } = useTheme();
//   const [currentStep, setCurrentStep] = useState(1);
//   const [userType, setUserType] = useState("");
//   const [formData, setFormData] = useState({});
//   const location = useLocation();
//   const params = useParams();
//   const [fundData, setFundData] = useState(location.state?.fundData || null);                                 // will use this in future
//   const [fundFields, setFundFields] = useState(location.state?.fundField || null);                            // will use this in future
//   const [fundSetting, setFundSetting] = useState(location.state?.fundSetting || null);                        // will use this in future
//   const [referenceDocuments, setreferenceDocuments] = useState(location.state?.referenceDocuments || null);   // will use this in future
//   const [isLoader, setIsLoader] = useState(false);
//   const [steps, setSteps] = useState(initialSteps);                                                           // Initialize with 3 steps
//   const isShowFaceVerificationVCIP = true;
//   let identitiesData = [];
//   const cancelTokenSource = axios.CancelToken.source();
//   const [dataOfAccountSetup, setDataOfAccountSetup] = useState({});
//   const [isAssistanceData, setIsAssistanceData] = useState(false);
//   const [isAssistAvail, setIsAssistAvail] = useState(false);
//   const [faceResponse, setFaceResponse] = useState(false);
//   const [imagesForfaceVerification, setImagesForfaceVerification] = useState({
//     img2_base64: null,
//     img1_base64: null,
//   });
//   const [
//     handleCallAPIForFaceVerficationData,
//     setHandleCallAPIForFaceVerficationData,
//   ] = useState(false);
//   const handleSetFaceImages = (data) => {
//     setImagesForfaceVerification(data);
//   };
//   const handleCallAPIForFaceVerficationDataUpdateFalse = () => {
//     setHandleCallAPIForFaceVerficationData(false);
//   };


//   // const [activeStep, setActiveStep] = useState(1);
//   // const [fundCode, setFundCode] = useState("");
//   // const [selectedIdentity, setSelectedIdentity] = useState({ value: "" });
//   // const [selectedIdentityData, setSelectedIdentityData] = useState();
//   // const [identitiesData, setIdentitiesData] = useState([]);
//   const [submitFaceVerificationAPI, setSubmitFaceVerificationAPI] = useState(false);


//   const [submitVCIPAPI, setSubmitVCIPAPI] = useState(false);
//   const [buttonDisabledForVCIP, setButtonDisabledForVCIP] = useState(false);
//   const [handleCallAPIForVCIPData, setHandleCallAPIForVCIPData] = useState(false);
//   // let identitiesData = [];
  
//   const handleAssistanceData = (data) => {
//     setIsAssistanceData(data);
//   };
//   const isHandleAssistanceData = (data) => {
//     setIsAssistAvail(data);
//   };
//   const handleApiResponseFace = (data) => {
//     console.log('data', data);
//     setFaceResponse(data);
//   };
//   function advanceSection() {
//     console.log("helo");
// }
// const faceVerificationCompleted = (data, redirect = false) => {
//   dataOfAccountSetup['faceVerification'] = data;
//   handleGetAccountDetail();
//   if (redirect) {
   
//   }
// };
// const handleGetAccountDetail = async () => {
//   const response = await getSingleAccountDetailByIdAPI(
//     dataOfAccountSetup?.account_id
//       ? dataOfAccountSetup?.account_id
//       : params?.account_id,
//     cancelTokenSource.token,
//   );
//   if (response.success === true) {
//     setIsLoader(false);
//     dataOfAccountSetup['accountData'] = response?.data?.account_detail;
//     setDataOfAccountSetup(dataOfAccountSetup);
//   }
// };
// const submitFaceVerification = (data) => {
//   setSubmitFaceVerificationAPI(data);
// };
//   console.log(referenceDocuments,"reefefefe")
  

//   useEffect(() => {
//     if (fundData && fundFields && fundSetting) {

//       handleDynamicSteps(); // Dynamically load steps based on fundData
//     }
//   }, [fundData]);

//   const handleDynamicSteps = async () => {
//     // setIsLoader(true);
//     // const responce = await getIdentityList(cancelTokenSource.token, fundData?.id);
//     // setIsLoader(false);
//     // console.log("Fund Id Response:", responce);
//     // console.log("Fund Data is here:", fundData);
//     // setIdentitiesData(responce.data);
    
    
//     let stepsData = [
//       { title: 'Select Account' },
//       { title: 'Identity Setup' },
//     ];
    
//     // identitiesData = responce?.data;
//     // console.log("Yeh Hai Identities ka data new new:", identitiesData);
//     const fundAccountSettings = fundData?.fund_setting?.account?.applicant?.identity;
//     const fundApplicationStatus = fundData?.fund_setting?.account?.subscription;
 
//     // Add Documents step as the third step
//     stepsData.push({ title: 'Documents' });

//     if (fundData?.isIndividual === undefined) {
//       // Handle undefined case
//       if (fundAccountSettings?.indivisual?.provider?.verify?.face?.enabled && isShowFaceVerificationVCIP) {
//         stepsData.push({ title: 'Face Verification' });
//       }
//       if (fundAccountSettings?.indivisual?.provider?.verify?.vcip?.enabled && isShowFaceVerificationVCIP) {
//         stepsData.push({ title: 'VCIP' });
//       }
//     } else {
//       // Check if the account type is individual or corporate
//       let customerType = fundData?.isIndividual ? 'individual' : 'corporate';

//       if (fundAccountSettings?.[customerType]?.provider?.verify?.face?.enabled && isShowFaceVerificationVCIP) {
//         stepsData.push({ title: 'Face Verification' });
//       }
//       if (fundAccountSettings?.[customerType]?.provider?.verify?.vcip?.enabled && isShowFaceVerificationVCIP) {
//         stepsData.push({ title: 'VCIP' });
//       }
//     }


//     if (
//       (fundAccountSettings?.bank?.enabled || fundAccountSettings?.wallet?.enabled) &&
//       fundData?.fund_data?.named_id?.toUpperCase() !== 'AXSA-WM'
//     ) {
//       stepsData.push({ title: 'Bank/Wallets' });
//     }

//     // Add Application as the second-last step before Summary
//     if (fundApplicationStatus?.status) {
//       stepsData.push({ title: 'Application' });
//     }

//     stepsData.push({ title: 'Summary' });

//     // Update the steps
//     setSteps(stepsData.map(step => step.title));
//   };
  

//   const handleNext = (data) => {
//     if (data) {
//       setFormData((prevData) => ({ ...prevData, ...data }));
//     }
//     if (currentStep < steps.length) {
//       setCurrentStep((prev) => prev + 1);
//     }
//   };

//   const handlePrev = () => {
//     if (currentStep > 1) {
//       setCurrentStep((prev) => prev - 1);
//     }
//   };

//   const handleUserTypeSelection = (type) => {
//     setUserType(type);
//     handleNext();
//   };

//   const vcipUpload = (data) => {
//     setButtonDisabledForVCIP(data?.status);
//     dataOfAccountSetup['vcip'] = data?.status;
   
//   };
//   const submitVCIP = (data) => {
//     console.log(data, 'data submitVCIP submitVCIP');
//     setSubmitVCIPAPI(data);
//     setButtonDisabledForVCIP(data);
//   };
//   const handleCallAPIForVCIPDataUpdateFalse = () => {
//     setHandleCallAPIForVCIPData(false);
//   };

//   const renderContent = () => {
//     const stepComponents = {
//       "Select Account": <UserType onSelection={handleUserTypeSelection} fundData={fundData} referenceDocuments={referenceDocuments} fundFields={fundFields}/>,
//       "Identity Setup": <UserForm userType={userType} fundData={fundData} fundFields={fundFields} identitiesData={identitiesData} onNext={(formValues) => handleNext(formValues)} />,
//       "Documents": <Documents />,
//       "Face Verification": <FaceVerification 
//       dataOfAccountSetup={dataOfAccountSetup}
//       handleAssistanceData={handleAssistanceData}
//       advanceSection={advanceSection}
//       isHandleAssistanceData={isHandleAssistanceData}
//       handleApiResponseFace={handleApiResponseFace}
//       faceVerificationCompleted={faceVerificationCompleted}
//       submitFaceVerification={submitFaceVerification}
//       handleCallAPIForFaceVerficationData={
//         handleCallAPIForFaceVerficationData
//       }
//       handleCallAPIForFaceVerficationDataUpdateFalse={
//         handleCallAPIForFaceVerficationDataUpdateFalse
//       }
//       handleSetFaceImages={handleSetFaceImages}
//       faceImages={imagesForfaceVerification}
//   />,
//       "VCIP": <VCIP
//       dataOfAccountSetup={dataOfAccountSetup}
//       vcipUpload={vcipUpload}
//       submitVCIP={submitVCIP}
//       handleCallAPIForVCIPData={handleCallAPIForVCIPData}
//       handleCallAPIForVCIPDataUpdateFalse={
//         handleCallAPIForVCIPDataUpdateFalse
//       } />,
//       "Bank/Wallets": <BankWallets fundData={fundData}/>,
//       "Application": <Application />,
//       "Summary": <Summary />
//     };

//     const currentStepName = steps[currentStep - 1]; // Get the name of the current step
//     return stepComponents[currentStepName] || null; // Render the corresponding component
//   };

//   return (
//     <>
//       <SideBar portalType="Customer" />
//       <div className={`bg-color-${theme} w-full px-4 py-4 sm:px-6 md:px-16 lg:px-24 md:py-5 lg:py-6 min-h-screen`}>
//         <ul className="relative flex flex-row gap-x-0 ml-14 mt-7">
//           {steps.map((step, index) => (
//             <li key={index} className={`shrink basis-0 flex-1 group ${index + 1 < currentStep ? "complete" : ""}`}>
//               <div className="min-w-10 min-h-10 w-full inline-flex items-center text-xs align-middle">
//                 <div className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex justify-center items-center shrink-0 rounded-full text-lg ml-2 sm:ml-4 md:ml-5 ${index + 1 === currentStep ? "bg-blue-500 text-white" : index + 1 < currentStep ? "bg-[#008000] text-gray-200" : "bg-gray-400 text-gray-800"}`}>
//                   {index + 1}
//                 </div>
//                 {index < steps.length - 1 && (
//                   <div className={`ms-1 w-full sm:w-[150%] md:w-[200%] h-px flex-grow group-last:hidden ${index + 1 < currentStep ? "bg-[#008000]" : "bg-gray-400"}`}></div>
//                 )}
//               </div>
//               <div className="mt-2 xs:mt-3 xs:mr-[10px] sm:mt-3 sm:mr-[15px] md:mt-4 md:mr-[25px] lg:mt-3 mr-[78px] xl:mr-[62px] 2xl:mr-[120px] text-center">
//                 <span className={`block text-sm md:text-base lg:text-sm ${index + 1 === currentStep ? " text-blue-500" : index + 1 < currentStep ? " text-green-700" : " text-gray-500"}`}>
//                   {step}
//                 </span>
//               </div>
//             </li>
//           ))}
//         </ul>

//         <div className={`bg-gradient-stepper-card-${theme} w-full shadow-[5px_5px_15px_5px_rgba(0,0,0,0.3)] mx-auto p-10 md:ml-4 md:mt-12 rounded-lg text-white flex flex-col justify-center`}>
//           {isLoader ? <Loader /> : renderContent()}
//           <hr className="w-[95%] border-t-[1px] border-t-[#6e84a3] opacity-30 my-6 mx-8" />
//           <div className="flex lg:space-x-[75%] md:justify-center sm:justify-center w-full p-4">
//             <Button text="Back" className={`bg-color-button-${theme} py-6 px-8 mr-[5%] border b-white hover:border-0 rounded-lg text-white focus:outline-none`} onClick={handlePrev} disabled={currentStep === 1} />
//             <Button text="Next" className={`bg-color-button-${theme} py-6 px-8 rounded-lg text-white`} onClick={() => handleNext(null)} disabled={currentStep === steps.length} />
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// export default Stepper;







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
import { getIdentityList, getSingleAccountDetailByIdAPI, postIdentityAPI } from "../../api/userApi";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import Loader from "../../components/ui/loader";

const initialSteps = ["Select Account", "Identity Setup", "Summary"];

function Stepper() {
  const { theme } = useTheme();
  const [currentStep, setCurrentStep] = useState(1);
  const [userType, setUserType] = useState("");
  const [formData, setFormData] = useState({});
  const [isLoader, setIsLoader] = useState(false);
  const [steps, setSteps] = useState(initialSteps);
  const [errorMessage, setErrorMessage] = useState(null);
  const [submitLoader, setSubmitLoader] = useState(false);
  const location = useLocation();
  const params = useParams();
  // const dataOfAccountSetups = [];
  const { dataOfAccountSetups, fundId } = location.state;

  console.log("dataOfAccountSetups1", dataOfAccountSetups);
  const [dataOfAccountSetupsState, setDataOfAccountSetupsState] = useState(
    dataOfAccountSetups || []
  );
  const isShowFaceVerificationVCIP = true;
  const [fundData, setFundData] = useState(location.state?.fundData || null);
  const [fundFields, setFundFields] = useState(location.state?.fundField || null);
  const [fundSetting, setFundSetting] = useState(location.state?.fundSetting || null);
  const [referenceDocuments, setreferenceDocuments] = useState(location.state?.referenceDocuments || null);
  const cancelTokenSource = axios.CancelToken.source();

  // ... (other state variables and useEffects remain the same)
  const [dataOfAccountSetup, setDataOfAccountSetup] = useState({});
  const [isAssistanceData, setIsAssistanceData] = useState(false);
  const [isAssistAvail, setIsAssistAvail] = useState(false);
  const [faceResponse, setFaceResponse] = useState(false);
  const [imagesForfaceVerification, setImagesForfaceVerification] = useState({
    img2_base64: null,
    img1_base64: null,
  });
  const [
    handleCallAPIForFaceVerficationData,
    setHandleCallAPIForFaceVerficationData,
  ] = useState(false);
  const handleSetFaceImages = (data) => {
    setImagesForfaceVerification(data);
  };
  const handleCallAPIForFaceVerficationDataUpdateFalse = () => {
    setHandleCallAPIForFaceVerficationData(false);
  };

  // const [activeStep, setActiveStep] = useState(1);
  // const [fundCode, setFundCode] = useState("");
  // const [selectedIdentity, setSelectedIdentity] = useState({ value: "" });
  // const [selectedIdentityData, setSelectedIdentityData] = useState();
  const [identitiesData, setIdentitiesData] = useState([]);
  const [submitFaceVerificationAPI, setSubmitFaceVerificationAPI] = useState(false);
  const [handleCallAPIForVCIPData, setHandleCallAPIForVCIPData] = useState(false);

  // const [identitiesData, setIdentitiesData] = useState([]);

  const [submitVCIPAPI, setSubmitVCIPAPI] = useState(false);
  const [buttonDisabledForVCIP, setButtonDisabledForVCIP] = useState(false);
  const [selectedIdentity, setSelectedIdentity] = useState(null);

  // let identitiesData = [];
  
  const handleAssistanceData = (data) => {
    setIsAssistanceData(data);
  };
  const isHandleAssistanceData = (data) => {
    setIsAssistAvail(data);
  };
  const handleApiResponseFace = (data) => {
    console.log("data", data);
    setFaceResponse(data);
  };
  function advanceSection() {
    console.log("helo");
  }

  const handleDataUpdate = (updatedAccountSetup) => {
    // Find the index of the account setup that needs to be updated
    const updatedArray = dataOfAccountSetupsState.map((item) => {
      if (item.fund_id === updatedAccountSetup.fund_id) {
        return {
          ...item,
          identity: updatedAccountSetup.identity,
          account: updatedAccountSetup.account,
        };
      }
      return item;
    });

    setDataOfAccountSetupsState(updatedArray);
  };

  const faceVerificationCompleted = (data, redirect = false) => {
    dataOfAccountSetup["faceVerification"] = data;
    handleGetAccountDetail();
    if (redirect) {
    }
  };
  const handleGetAccountDetail = async () => {
    const response = await getSingleAccountDetailByIdAPI(
      dataOfAccountSetup?.account_id
        ? dataOfAccountSetup?.account_id
        : params?.account_id,
      cancelTokenSource.token
    );
    if (response.success === true) {
      setIsLoader(false);
      dataOfAccountSetup["accountData"] = response?.data?.account_detail;
      setDataOfAccountSetup(dataOfAccountSetup);
    }
  };
  const submitFaceVerification = (data) => {
    setSubmitFaceVerificationAPI(data);
  };
  console.log(referenceDocuments, "reefefefe");

  useEffect(() => {
    if (fundData && fundFields && fundSetting) {
      handleDynamicSteps(); // Dynamically load steps based on fundData
    }
  }, [fundData]);

  const handleDynamicSteps = async () => {
    // setIsLoader(true);
    // const responce = await getIdentityList(cancelTokenSource.token, fundData?.id);
    // setIsLoader(false);
    // console.log("Fund Id Response:", responce);
    // console.log("Fund Data is here:", fundData);
    // setIdentitiesData(responce.data);
    
    
    let stepsData = [
      { title: 'Select Account' },
      { title: 'Identity Setup' },
    ];
    
    // identitiesData = responce?.data;
    // console.log("Yeh Hai Identities ka data new new:", identitiesData);
    const fundAccountSettings = fundData?.fund_setting?.account?.applicant?.identity;
    const fundApplicationStatus = fundData?.fund_setting?.account?.subscription;

    // Add Documents step as the third step
    stepsData.push({ title: "Documents" });

    if (fundData?.isIndividual === undefined) {
      // Handle undefined case
      if (
        fundAccountSettings?.indivisual?.provider?.verify?.face?.enabled &&
        isShowFaceVerificationVCIP
      ) {
        stepsData.push({ title: "Face Verification" });
      }
      if (
        fundAccountSettings?.indivisual?.provider?.verify?.vcip?.enabled &&
        isShowFaceVerificationVCIP
      ) {
        stepsData.push({ title: "VCIP" });
      }
    } else {
      // Check if the account type is individual or corporate
      let customerType = fundData?.isIndividual ? 'individual' : 'corporate';

      if (
        fundAccountSettings?.[customerType]?.provider?.verify?.face?.enabled &&
        isShowFaceVerificationVCIP
      ) {
        stepsData.push({ title: "Face Verification" });
      }
      if (
        fundAccountSettings?.[customerType]?.provider?.verify?.vcip?.enabled &&
        isShowFaceVerificationVCIP
      ) {
        stepsData.push({ title: "VCIP" });
      }
    }

    if (
      (fundAccountSettings?.bank?.enabled ||
        fundAccountSettings?.wallet?.enabled) &&
      fundData?.fund_data?.named_id?.toUpperCase() !== "AXSA-WM"
    ) {
      stepsData.push({ title: "Bank/Wallets" });
    }

    // Add Application as the second-last step before Summary
    if (fundApplicationStatus?.status) {
      stepsData.push({ title: "Application" });
    }

    stepsData.push({ title: "Summary" });

    // Update the steps
    setSteps(stepsData.map((step) => step.title));
  };

  const handleNext = async () => {
    if (currentStep === steps.indexOf("Select Account") + 1) {
      if (!selectedIdentity && !userType) {
        setErrorMessage({ error: true, message: "Please select an identity or user type." });
        return;
      }
    } else if (currentStep === steps.indexOf("Identity Setup") + 1) {
      await handleSubmitCall(formData);
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

  const handleUserTypeSelection = (data) => {
    if (data.isNewIdentity) {
      setUserType(data.type);
      setSelectedIdentity(null);
    } else {
      setSelectedIdentity(data);
      setUserType(data.type === "INDIVIDUAL" ? "individual" : "corporate");
    }
  };

  const vcipUpload = (data) => {
    setButtonDisabledForVCIP(data?.status);
    dataOfAccountSetup["vcip"] = data?.status;
  };
  const submitVCIP = (data) => {
    console.log(data, "data submitVCIP submitVCIP");
    const submitVCIP = (data) => {
    console.log(data, 'data submitVCIP submitVCIP');
    setSubmitVCIPAPI(data);
    setButtonDisabledForVCIP(data);
  }};

  const handleFormChange = (data) => {
    setFormData(data);
  };

  const handleSubmitCall = async (data) => {
    setSubmitLoader(true);
    try {
      const response = await postIdentityAPI(data, cancelTokenSource.token);
      if (response) {
        setErrorMessage(null);
      } else {
        setErrorMessage({ error: true, message: response.user_message });
      }
    } catch (error) {
      setErrorMessage({
        error: true,
        message: "An error occurred while submitting the form.",
      });
    } finally {
      setSubmitLoader(false);
    }
  };

    const handleCallAPIForVCIPDataUpdateFalse = () => {
    setHandleCallAPIForVCIPData(false);
  };

  const renderContent = () => {
    const stepComponents = {
      "Select Account": <UserType onSelection={handleUserTypeSelection} fundData={fundData} referenceDocuments={referenceDocuments} fundFields={fundFields}/>,
      "Identity Setup": <UserForm userType={userType} fundData={fundData} fundFields={fundFields} identitiesData={selectedIdentity} onFormChange={handleFormChange} />,
      "Documents": <Documents />,
      "Face Verification": <FaceVerification 
      dataOfAccountSetup={dataOfAccountSetup}
      handleAssistanceData={handleAssistanceData}
      advanceSection={advanceSection}
      isHandleAssistanceData={isHandleAssistanceData}
      handleApiResponseFace={handleApiResponseFace}
      faceVerificationCompleted={faceVerificationCompleted}
      submitFaceVerification={submitFaceVerification}
      handleCallAPIForFaceVerficationData={
        handleCallAPIForFaceVerficationData
      }
      handleCallAPIForFaceVerficationDataUpdateFalse={
        handleCallAPIForFaceVerficationDataUpdateFalse
      }
      handleSetFaceImages={handleSetFaceImages}
      faceImages={imagesForfaceVerification}
  />,
      "VCIP": <VCIP
      dataOfAccountSetup={dataOfAccountSetup}
      vcipUpload={vcipUpload}
      submitVCIP={submitVCIP}
      handleCallAPIForVCIPData={handleCallAPIForVCIPData}
      handleCallAPIForVCIPDataUpdateFalse={
        handleCallAPIForVCIPDataUpdateFalse
      } />,
      "Bank/Wallets": <BankWallets fundData={fundData}/>,
      "Application": <Application />,
      "Summary": <Summary />
    };

    const currentStepName = steps[currentStep - 1];
    return stepComponents[currentStepName] || null;
  };

  const isNextButtonDisabled = () => {
    if (currentStep === steps.indexOf("Select Account") + 1) {
      return !selectedIdentity && !userType;
    }
    // Add more conditions for other steps if needed
    return false;
  };

  return (
    <>
      <SideBar portalType="Customer" />
      <div className={`bg-color-${theme} w-full px-4 py-4 sm:px-6 md:px-16 lg:px-24 md:py-5 lg:py-6 min-h-screen`}>
      <ul className="relative flex flex-row gap-x-0 ml-14 mt-7">
          {steps.map((step, index) => (
            <li
              key={index}
              className={`shrink basis-0 flex-1 group ${
                index + 1 < currentStep ? "complete" : ""
              }`}
            >
              <div className="min-w-10 min-h-10 w-full inline-flex items-center text-xs align-middle">
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
              <div className="mt-2 xs:mt-3 xs:mr-[10px] sm:mt-3 sm:mr-[15px] md:mt-4 md:mr-[25px] lg:mt-3 mr-[78px] xl:mr-[62px] 2xl:mr-[120px] text-center">
                <span
                  className={`block text-sm md:text-base lg:text-sm ${
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
        {/* Stepper UI remains the same */}
        <div className={`bg-gradient-stepper-card-${theme} w-full shadow-[5px_5px_15px_5px_rgba(0,0,0,0.3)] mx-auto p-10 md:ml-4 md:mt-12 rounded-lg text-white flex flex-col justify-center`}>
          {isLoader ? <Loader /> : renderContent()}
          {errorMessage && (
            <div className="text-red-500 mt-4">{errorMessage.message}</div>
          )}
          <hr className="w-[95%] border-t-[1px] border-t-[#6e84a3] opacity-30 my-6 mx-8" />
          <div className="flex lg:space-x-[75%] md:justify-center sm:justify-center w-full p-4">
            <Button 
              text="Back" 
              className={`bg-color-button-${theme} py-6 px-8 mr-[5%] border b-white hover:border-0 rounded-lg text-white focus:outline-none`} 
              onClick={handlePrev} 
              disabled={currentStep === 1} 
            />
            <Button 
              text={currentStep === steps.indexOf("Identity Setup") + 1 ? (submitLoader ? "Saving..." : "Save & Next") : "Next"} 
              className={`bg-color-button-${theme} py-6 px-8 rounded-lg text-white ${
                isNextButtonDisabled() ? "opacity-50 cursor-not-allowed" : "hover:opacity-80"
              }`}
              onClick={handleNext} 
              disabled={currentStep === steps.length || submitLoader || isNextButtonDisabled()} 
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Stepper;
