//Mine Work
// import React, { useState, useEffect } from "react";
// import Button from "../../../components/ui/button/Button";
// import { useTheme } from "../../../contexts/themeContext";
// import {
//   getDataSignedUrl,
//   getSingleAccountDetailByIdAPI,
//   FaceVerificationApi,
// } from "../../../api/userApi";
// import axios from "axios";
// import Loader from "../../../components/ui/loader";
// import faceimg from "../../../assets/face.png";
// import CameraCapture from "../../../components/camera/captureImage";

// function FaceVerification(props) {
//   const { dataOfAccountSetups } = props;
//   console.log("dataOfAccountSetups4", dataOfAccountSetups);
//   const { theme } = useTheme();
//   const [isLoader, setIsLoader] = useState(false);
//   const [apiResponse, setApiResponse] = useState([]);
//   const [face, setFace] = useState(null);
//   const [identification, setIdentification] = useState(null);
//   const [isCameraActive, setIsCameraActive] = useState(false);
//   const [isFaceSnapsUploaded, setIsFaceSnapsUploaded] = useState({
//     error: false,
//     message: "",
//   });
//   const [faceKey, setFaceKey] = useState(
//     props?.dataOfAccountSetups?.fund_data?.fund_setting?.account?.applicant
//       ?.identity[
//       props?.dataOfAccountSetup?.isIndividual ? "indivisual" : "corporate"
//     ]?.provider?.verify?.face?.steps[0]?.key
//   );
//   const [assistanceData, setAssistanceData] = useState(
//         identity_id
//           ? props?.dataOfAccountSetups?.accountData?.attach_identities[0]?.meta
//               ?.identities[identity_id]?.faceVerification
//           : null
//       );

//   const [imageDataOne, setImageDataOne] = useState(null);
//     const [isLocationEnabled, setIsLocationEnabled] = useState(true);

//   const cancelTokenSource = axios.CancelToken.source();

//   const handleGetAccountDetail = async () => {
//     setIsLoader(true);
//     try {
//       const response = await getSingleAccountDetailByIdAPI(
//         "e00edd10-4270-4073-8c69-e0d718012999",
//         cancelTokenSource.token
//       );
//       setIsLoader(false);

//       if (response.success === true) {
//         const accountDetails =
//           response?.data?.account_detail?.attach_identities?.[0]?.meta
//             ?.identities?.["53c8a88a-cc42-4da4-958b-71e79df5ad5f"]
//             ?.faceVerification;

//         setApiResponse(accountDetails);
//         console.log("setApiResponse1", accountDetails);
//         console.log("setApiResponsess", apiResponse);
//       }
//     } catch (error) {
//       if (axios.isCancel(error)) {
//         console.log("Request canceled:", error.message);
//       } else {
//         console.error("Error fetching account details:", error);
//       }
//       setIsLoader(false);
//     }
//   };
// const renderImages = async () => {
//   if (apiResponse?.images?.face) {
//     setIsLoader(true);
//     const dataToSend = {
//       key: apiResponse?.images?.face,
//     };
//     const response = await getDataSignedUrl(
//       dataToSend,
//       cancelTokenSource.token
//     );
//     setIsLoader(false);
//     if (response.success === true) {
//       console.log(response?.data, "response?.data");
//       setFace(faceimg);
//     } else {
//       console.log(response, "error");
//     }
//   }
//   if (apiResponse?.images?.identification) {
//     setIsLoader(true);
//     const dataToSend = {
//       key: apiResponse?.images?.identification,
//     };
//     const response = await getDataSignedUrl(
//       dataToSend,
//       cancelTokenSource.token
//     );
//     setIsLoader(false);
//     if (response.success === true) {
//       console.log(response?.data, "response?.data");
//       setIdentification(faceimg);
//     } else {
//       console.log(response, "error");
//     }
//   }
// };
//   useEffect(() => {
//     handleGetAccountDetail();
//   }, []);

//   useEffect(() => {
//     renderImages();
//   }, [apiResponse]);

//   const submitFaceVerification = async () => {
//     props?.handleApiResponseFace(false);
//     setIsLoader(true);

//     if (capturedMediaStream) {
//       capturedMediaStream.getTracks().forEach((track) => {
//         track.stop();
//       });
//     }

//     const modifiedImageCapturedData = { ...imageCapturedData };

//     if (
//       !modifiedImageCapturedData.img1_base64 ||
//       !modifiedImageCapturedData.img2_base64
//     ) {
//       console.error("Image capture data is missing!");
//       setIsLoader(false);
//       setIsFaceSnapsUploaded({
//         error: true,
//         message: "Please capture both images before proceeding.",
//       });
//       return;
//     }

//     modifiedImageCapturedData.img1_base64 =
//       modifiedImageCapturedData.img1_base64.startsWith("data:")
//         ? modifiedImageCapturedData.img1_base64.split(",")[1]
//         : modifiedImageCapturedData.img1_base64;

//     modifiedImageCapturedData.img2_base64 =
//       modifiedImageCapturedData.img2_base64.startsWith("data:")
//         ? modifiedImageCapturedData.img2_base64.split(",")[1]
//         : modifiedImageCapturedData.img2_base64;

//     modifiedImageCapturedData.location = locationData;

//     if (locationData?.latitude === null) {
//       setIsLocationEnabled(false);
//     } else {
//       setIsLocationEnabled(true);
//     }

//     try {
//       const response = await FaceVerificationApi(
//         modifiedImageCapturedData,
//         identity_id,
//         shareHolderID,
//         cancelTokenSource.token
//       );
//       setIsLoader(false);

//       if (response.success) {
//         props?.handleApiResponseFace(true);
//         setAssistanceData(response.data?.faceVerification);
//         setIsAssistance(
//           response.data?.faceVerification?.hasOwnProperty("assistance")
//         );
//         if (response.data?.faceVerification?.hasOwnProperty("assistance")) {
//           props?.handleAssistanceData(true);
//           handleShow(true);
//         } else {
//           handleShow(false);
//           props?.advanceSection();
//           props?.faceVerificationCompleted(true);
//         }
//         setApiResponse(response.data?.faceVerification);
//         setIsFaceSnapsUploaded({ error: false, message: "" });
//       } else {
//         setIsFaceSnapsUploaded({
//           error: true,
//           message: `${response?.user_message} Please capture the images again.`,
//         });
//         props?.handleApiResponseFace(false);
//       }
//     } catch (error) {
//       console.error("API error:", error);
//       setIsLoader(false);
//     }
//   };

//   const handleProceedClick = () => {
//     setIsCameraActive(true);
//   };

//   const handleChangeLocation = (data) => {
//     setLocationData(data);
//   };

//   const handleImageCaptureOne = (data) => {
//     if (data?.faceSnapkey === "img1_base64") {
//       props?.handleSetFaceImages({
//         ...props?.faceImages,
//         img1_base64: imageCapturedData["img1_base64"],
//       });
//     } else {
//       props?.handleSetFaceImages({
//         ...props?.faceImages,
//         img2_base64: imageCapturedData["img2_base64"],
//       });
//     }
//   };

//   setImageDataOne(capturedImageData);
//   console.log("data handleImageCaptureOne");

//   const cameraClose = (stream, videoRef) => {
//     if (stream) {
//       stream.getTracks().forEach((track) => {
//         console.log("Stopping camera track", track);
//         track.stop();
//       });
//     }
//   };

//   const resetData = (faceSnapkey = null) => {
//     if (faceSnapkey === "img1_base64") {
//       props?.handleSetFaceImages({
//         ...props?.faceImages,
//         img1_base64: null,
//       });
//     } else if (faceSnapkey === "img2_base64") {
//       props?.handleSetFaceImages({
//         ...props?.faceImages,
//         img2_base64: null,
//       });
//     } else {
//       props?.handleSetFaceImages({
//         img1_base64: null,
//         img2_base64: null,
//       });
//     }
//   };
//   useEffect(() => {
//     if (face && identification) {
//       props?.faceVerificationCompleted(true, false);
//       props?.handleSetFaceImages({
//         img2_base64: face,
//         img1_base64: identification,
//       });
//     }
//   }, [face, identification]);

//   return (
//     <>
//       {isLoader ? (
//         <Loader />
//       ) : (
//         <>
//           <div className={`mt-2 border-b-4 border-color-${theme} px-2`}>
//             <h1 className="text-xl lg:text-2xl mb-2">Liveliness Test</h1>
//             <p className="text-sm lg:text-md mb-6 mt-4 uppercase">
//               To meet the regulatory KYC and AML/CFT requirements, this step
//               helps us to ensure that you are who you say you are.
//             </p>
//           </div>
//           <div className="flex flex-col lg:flex-row lg:space-x-8 mt-8 lg:mt-[74px] justify-center px-4">
//             <>
//               <div
//                 className={`bg-color-stepper-card-${theme} p-6 rounded-lg w-full lg:w-[40%] shadow-[5px_5px_15px_5px_rgba(0,0,0,0.3)] mb-8 lg:mb-0`}
//               >
//                 <h2
//                   className={`bg-color-stepper-card-${theme} text-lg p-4 rounded-md mb-4 text-center shadow-[5px_5px_15px_5px_rgba(0,0,0,0.3)] uppercase`}
//                 >
//                   Face Verification
//                 </h2>
//                 {face !== null ? (
//                   <img src={face} alt="" className="w-full h-auto rounded-lg" />
//                 ) : isCameraActive ? (
//                   <CameraCapture
//                     handleChangeLocation={handleChangeLocation}
//                     onImageCapture={handleImageCaptureOne}
//                     cameraCloseBrowser={cameraClose}
//                     resetData={resetData}
//                     isFaceSnapsUploaded={isFaceSnapsUploaded}
//                     handleSetFaceImages={props?.handleSetFaceImages}
//                     faceImages={props?.faceImages}
//                     dataOfAccountSetup={dataOfAccountSetups}
//                     faceSnapKey={faceKey}
//                   />
//                 ) : (
//                   <>
//                     <div className="flex flex-col items-center mb-4 mt-20">
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         className="h-24 w-24 text-sky-500"
//                         viewBox="0 0 24 24"
//                         fill="currentColor"
//                       >
//                         <path
//                           fillRule="evenodd"
//                           d="M12 2a6 6 0 00-6 6v1H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2v-6a2 2 0 00-2-2h-2V8a6 6 0 00-6-6zm-1 11a1 1 0 112 0v2a1 1 0 11-2 0v-2zm1-5a3 3 0 00-2.83 2H10a1 1 0 000 2h4a1 1 0 000-2h-.17A3 3 0 0012 8z"
//                           clipRule="evenodd"
//                         />
//                       </svg>
//                       <p className="text-center text-sm lg:text-lg mt-10 uppercase">
//                         Position your face within the designated area.
//                       </p>
//                       <Button
//                         text="Proceed"
//                         className={`bg-color-stepper-proceedbutton-${theme} hover:bg-red-600 text-white py-4 lg:py-[20px] px-4 rounded-lg mx-auto block mt-10`}
//                         onClick={handleProceedClick}
//                       />
//                     </div>
//                   </>
//                 )}
//               </div>
// <div
//   className={`bg-color-stepper-card-${theme} p-6 rounded-lg w-full lg:w-[40%] shadow-[5px_5px_15px_5px_rgba(0,0,0,0.3)] mb-8 lg:mb-0`}
// >
//   <h2
//     className={`bg-color-stepper-card-${theme} text-lg p-4 rounded-md mb-4 text-center shadow-[5px_5px_15px_5px_rgba(0,0,0,0.3)] uppercase`}
//   >
//     National ID / Passport with Photo
//   </h2>
//   {identification !== null ? (
//     <img
//       src={identification}
//       alt=""
//       className="w-full h-auto rounded-lg"
//     />
//   ) : (
//     <>
//       <div className="flex flex-col items-center mb-4 mt-20">
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           className="h-24 w-24 text-sky-500"
//           viewBox="0 0 24 24"
//           fill="currentColor"
//         >
//           <path
//             fillRule="evenodd"
//             d="M12 2a6 6 0 00-6 6v1H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2v-6a2 2 0 00-2-2h-2V8a6 6 0 00-6-6zm-1 11a1 1 0 112 0v2a1 1 0 11-2 0v-2zm1-5a3 3 0 00-2.83 2H10a1 1 0 000 2h4a1 1 0 000-2h-.17A3 3 0 0012 8z"
//             clipRule="evenodd"
//           />
//         </svg>
//         <p className="text-center text-sm lg:text-lg mt-10 uppercase">
//           Position your face within the designated area.
//         </p>
//         <Button
//           text="Proceed"
//           className={`bg-color-stepper-proceedbutton-${theme} hover:bg-red-600 text-white py-4 lg:py-[20px] px-4 rounded-lg mx-auto block mt-10`}
//           onClick={handleProceedClick}
//         />
//       </div>
//     </>
//   )}
// </div>
//             </>
//           </div>
//         </>
//       )}
//     </>
//   );
// }
// export default FaceVerification;

import React, { useState, useEffect, useRef } from "react";
import Button from "../../../components/ui/button/Button";
import { useTheme } from "../../../contexts/themeContext";
import {
  getDataSignedUrl,
  getSingleAccountDetailByIdAPI,
  FaceVerificationApi,
} from "../../../api/userApi";
import axios from "axios";
import Loader from "../../../components/ui/loader";
import faceimg from "../../../assets/face.png";
import CameraCapture from "../../../components/camera/captureImage";

function FaceVerification(props) {
  const { dataOfAccountSetups } = props;
  const { handleAssistanceData,advanceSection,isHandleAssistanceData,faceVerificationCompleted,submitFaceVerification,handleCallAPIForFaceVerficationData,handleCallAPIForFaceVerficationDataUpdateFalse,
    handleSetFaceImages,faceImages } = props;
  console.log("dataOfAccountSetups4", dataOfAccountSetups);
  const { theme } = useTheme();
  const [isLoader, setIsLoader] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);
  const [face, setFace] = useState(null);
  const [identification, setIdentification] = useState(null);
  const [showSubmit, setShowSubmit] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isFaceSnapsUploaded, setIsFaceSnapsUploaded] = useState({
    error: false,
    message: "",
  });
  const [faceKey, setFaceKey] = useState(
    props?.dataOfAccountSetups?.[0]?.data?.fundData?.fund_data?.fund_setting
      ?.account?.applicant?.identity?.indivisual?.provider?.verify?.face
      ?.steps?.[0]?.key || null
  );
  console.log("faceKey", faceKey);
  // const [assistanceData, setAssistanceData] = useState(null);
  const [imageDataOne, setImageDataOne] = useState(null);
  const [isLocationEnabled, setIsLocationEnabled] = useState(true);
  const [capturedMediaStream, setCapturedMediaStream] = useState(null);
  const [imageCapturedData, setImageCapturedData] = useState({});
  const [shareHolderID, setShareHolderID] = useState(null);
  const [proceed, setProceed] = useState(false);

  const [assistanceData, setAssistanceData] = useState(
    props?.dataOfAccountSetup?.accountData?.attach_identities[0]?.meta
      ?.identities
      ? props?.dataOfAccountSetup?.accountData?.attach_identities[0]?.meta
          ?.identities[identity_id]?.faceVerification
      : null,
  );

  const [faceSnapDataConfiguration, setFaceSnapDataConfiguration] = useState(
    props?.dataOfAccountSetups?.[0]?.data?.fundData?.fund_data?.fund_setting
      ?.account?.applicant?.identity?.indivisual?.provider?.verify?.face
  );

  const [locationData, setLocationData] = useState({
    latitude: null,
    longitude: null,
  });

  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  const cancelTokenSource = axios.CancelToken.source();
  const videoRef = useRef(null);


  useEffect(() => {
    handleGetAccountDetail();
  }, []);

  useEffect(() => {
    console.log("locationDatalocationData", locationData);
  }, [locationData]);

  useEffect(() => {
    console.log("vvvface", face);
    console.log("vvvface faceSnapDataConfiguration", faceSnapDataConfiguration);
  }, [face, faceSnapDataConfiguration]);

  useEffect(() => {
    if (face && identification) {
      props?.faceVerificationCompleted(true, false);
      props?.handleSetFaceImages({
        img2_base64: face,
        img1_base64: identification,
      });
    }
  }, [face, identification]);

  useEffect(() => {
    if (props.handleCallAPIForFaceVerficationData) {
      console.log(imageCapturedData, "imageCapturedData");
      // return;
      if (
        imageCapturedData["img1_base64"] &&
        imageCapturedData["img2_base64"]
      ) {
        submitFaceVerfication();
      } else {
        props?.faceVerificationCompleted(true, true);
      }
      props.handleCallAPIForFaceVerficationDataUpdateFalse();
    }
  }, [props.handleCallAPIForFaceVerficationData]);


  useEffect(() => {
   renderImages();
  }, [apiResponse]);



  const handleGetAccountDetail = async () => {
    
    console.log("account_id",dataOfAccountSetups?.[0]?.data?.account?.account_id);
    setIsLoader(true);
      const response = await getSingleAccountDetailByIdAPI(
        dataOfAccountSetups?.[0]?.data?.account?.account_id,
        cancelTokenSource.token
      );
      setIsLoader(false);

      if (response.success) {
        setShareHolderID(
          response?.data?.account_detail?.attach_identities[0]?.id
        );
        // const accountDetails =
        //   response?.data?.account_detail?.attach_identities?.[0]?.meta
        //     ?.identities?.["53c8a88a-cc42-4da4-958b-71e79df5ad5f"]
        //     ?.faceVerification;

        console.log("response handleGetAccountDetail",response?.data)
        const accountDetails =
          response?.data?.account_detail?.attach_identities?.[0]?.meta
            ?.identities?.[
            dataOfAccountSetups?.[0]?.data?.identity?.identity_id
          ]?.faceVerification;
          console.log("accountDetails",accountDetails);

        setApiResponse(accountDetails);
      }
    
  };

  const renderImages = async () => {
    if (apiResponse?.images?.face) {
      setIsLoader(true);
      const dataToSend = {
        key: apiResponse?.images?.face,
      };
      const response = await getDataSignedUrl(
        dataToSend,
        cancelTokenSource.token
      );
      setIsLoader(false);
      if (response.success === true) {
        console.log(response?.data, "response?.data");
        setFace(response?.data);
      } else {
        console.log(response, "error");
      }
    }
    if (apiResponse?.images?.identification) {
      setIsLoader(true);
      const dataToSend = {
        key: apiResponse?.images?.identification,
      };
      const response = await getDataSignedUrl(
        dataToSend,
        cancelTokenSource.token
      );
      setIsLoader(false);
      if (response.success === true) {
        console.log(response?.data, "response?.data");
        setIdentification(faceimg);
      } else {
        console.log(response, "error");
      }
    }
  };

  const handleImageCaptureOne = (data) => {
    if (data?.faceSnapkey === "img1_base64") {
      props?.handleSetFaceImages({
        ...props?.faceImages,
        img1_base64: imageCapturedData["img1_base64"],
      });
    } else {
      props?.handleSetFaceImages({
        ...props?.faceImages,
        img2_base64: imageCapturedData["img2_base64"],
      });
    }

    setImageDataOne(data?.capturedImageData);
    console.log(data, "data handleImageCaptureOne");
    imageCapturedData[data?.faceSnapkey] = data?.capturedImageData;
    setImageCapturedData(imageCapturedData);
    console.log(imageCapturedData, "imageCapturedData");

    if (faceSnapDataConfiguration?.steps[data?.index + 1]) {
      setFaceKey(faceSnapDataConfiguration?.steps[data?.index + 1]?.key);
      if (
        data?.faceSnapkey === "img1_base64" &&
        imageCapturedData["img2_base64"]
      ) {
        props.submitFaceVerification(true);
      }
    } else {
      if (
        imageCapturedData["img1_base64"] &&
        imageCapturedData["img2_base64"]
      ) {
        props.submitFaceVerification(true);
        setShowSubmit(true);
      }
    }
    console.log(data, "data");
  };



  const cameraClose = (stream) => {
    if (stream) {
      stream.getTracks().forEach((track) => {
        track.stop();
      });
    }
  };

  const resetData = (faceSnapkey = null) => {
    if (faceSnapkey === "img1_base64") {
      props?.handleSetFaceImages({
        ...props?.faceImages,
        img1_base64: null,
      });
    } else if (faceSnapkey === "img2_base64") {
      props?.handleSetFaceImages({
        ...props?.faceImages,
        img2_base64: null,
      });
    } else {
      props?.handleSetFaceImages({
        img1_base64: null,
        img2_base64: null,
      });
    }
  };

  const handleChangeLocation = (data) => {
    setLocationData(data);
  };
  const handleProceedClick = (key) => {
    setFaceKey(key);
    imageCapturedData[key] = {};
    console.log(imageCapturedData, "imageCapturedData");
    setImageCapturedData(imageCapturedData);
    setProceed(true);
    setIsCameraActive(true);
  };
  // const handleProceedClick = () => setIsCameraActive(true); // Activates camera
  // const handleProceedClicks = () => setIsCameraActive(true); // Activates camera

  // const submitFaceVerfications = async () => {
  //   props?.handleApiResponseFace(false);
  //   setIsLoader(true);

  //   if (capturedMediaStream) {
  //     capturedMediaStream.getTracks().forEach((track) => {
  //       track.stop();
  //     });
  //   }
  //   console.log(imageCapturedData, "dataToSend");
  //   const modifiedImageCapturedData = { ...imageCapturedData };

  //   modifiedImageCapturedData.img1_base64 =
  //     modifiedImageCapturedData.img1_base64.split("data:image/png;base64,")[1];
  //   modifiedImageCapturedData.img2_base64 =
  //     modifiedImageCapturedData.img2_base64.split("data:image/png;base64,")[1];
  //   modifiedImageCapturedData.location = locationData;

  //   console.log("modifiedImageCapturedData", modifiedImageCapturedData);
  //   if (locationData?.latitude === null) {
  //     setIsLocationEnabled(false);
  //   } else {
  //     setIsLocationEnabled(true);
  //   }

  //   const response = await FaceVerificationApi(
  //     modifiedImageCapturedData,
  //     cancelTokenSource.token,
  //     dataOfAccountSetups?.[0]?.data?.identity?.identity_id,
  //     shareHolderID
  //   );
  //   setIsLoader(false);
  //   if (response.success == true) {
  //     props?.handleApiResponseFace(true);

  //     setAssistanceData(response.data?.faceVerification);
  //     setIsAssistance(
  //       response.data?.faceVerification?.hasOwnProperty("assistance")
  //         ? true
  //         : false
  //     );

  //     if (response.data?.faceVerification?.hasOwnProperty("assistance")) {
  //       props?.handleAssistanceData(true);
  //       handleShow(true);
  //       props?.isHandleAssistanceData(true);
  //     } else {
  //       handleShow(false);
  //       props?.isHandleAssistanceData(false);
  //       props?.advanceSection();
  //       props?.faceVerificationCompleted(true);
  //     }

  //     console.log(
  //       response.data?.faceVerification,
  //       "response.data?.faceVerification"
  //     );
  //     setApiResponse(response.data?.faceVerification);
  //     setIsFaceSnapsUploaded({ error: false, message: "" });
  //   } else {
  //     console.log(response, "error");
  //     setIsFaceSnapsUploaded({
  //       error: true,
  //       message: `${response?.user_message} Please again capture the images`,
  //     });
  //     props?.handleApiResponseFace(false);
  //   }
  // };
  const submitFaceVerfication = async () => {
    props?.handleApiResponseFace(false);
    setIsLoader(true);
    
    if (capturedMediaStream) {
      capturedMediaStream.getTracks().forEach((track) => {
        track.stop();
      });
    }
    console.log(imageCapturedData, 'dataToSend');
    const modifiedImageCapturedData = { ...imageCapturedData };

    modifiedImageCapturedData.img1_base64 =
      modifiedImageCapturedData.img1_base64.split('data:image/png;base64,')[1];
    modifiedImageCapturedData.img2_base64 =
      modifiedImageCapturedData.img2_base64.split('data:image/png;base64,')[1];
    modifiedImageCapturedData.location = locationData;

    console.log('modifiedImageCapturedData', modifiedImageCapturedData);
    if (locationData?.latitude === null) {
      setIsLocationEnabled(false);
    } else {
      setIsLocationEnabled(true);
    }

    const response = await FaceVerificationApi(
      modifiedImageCapturedData,
      cancelTokenSource.token,
      dataOfAccountSetups?.[0]?.data?.identity?.identity_id,
      shareHolderID,
    );
    setIsLoader(false);
    if (response.success == true) {
      props?.handleApiResponseFace(true);

      setAssistanceData(response.data?.faceVerification);
      setIsAssistance(
        response.data?.faceVerification?.hasOwnProperty('assistance')
          ? true
          : false,
      );

      if (response.data?.faceVerification?.hasOwnProperty('assistance')) {
        props?.handleAssistanceData(true);
        handleShow(true);
        props?.isHandleAssistanceData(true);
      } else {
        handleShow(false);
        props?.isHandleAssistanceData(false);
        props?.advanceSection();
        props?.faceVerificationCompleted(true);
      }

      console.log(
        response.data?.faceVerification,
        'response.data?.faceVerification',
      );
      setApiResponse(response.data?.faceVerification);
      setIsFaceSnapsUploaded({ error: false, message: '' });
    } else {
      console.log(response, 'error');
      setIsFaceSnapsUploaded({
        error: true,
        message: `${response?.user_message} Please again capture the images`,
      });
      props?.handleApiResponseFace(false);
     
    }
  };

  
  return (
    <>
      {isLoader ? (
        <Loader />
      ) : (
        <>
          <div className={`mt-2 border-b-4 border-color-${theme} px-2`}>
            <h1 className="text-xl lg:text-2xl mb-2">Liveliness Test</h1>
            <p className="text-sm lg:text-md mb-6 mt-4 uppercase">
              To meet the regulatory KYC and AML/CFT requirements, this step
              helps us to ensure that you are who you say you are.
            </p>
          </div>
          

          <div className="flex flex-col lg:flex-row  lg:space-x-8 mt-8 lg:mt-[74px] justify-center px-4">
            <div
              className={`bg-color-stepper-card-${theme} flex flex-col lg:flex-row p-6 lg:justify-around rounded-lg w-full  shadow-[5px_5px_15px_5px_rgba(0,0,0,0.3)] mb-8 lg:mb-0`}
            >
              {faceSnapDataConfiguration?.steps &&
                faceSnapDataConfiguration?.steps.map((item, index) => (
                  <div
                    key={index}
                    className="w-full lg:w-[40%] xl:w-[40%] mb-8 flex justify-center"
                    style={{
                      opacity:
                        faceKey == item?.key ||
                        imageCapturedData[item?.key] ||
                        face
                          ? 1
                          : 0.5,
                    }}
                  >
                    <div
                      className={`bg-color-stepper-card-${theme}  p-6 rounded-lg shadow-[5px_5px_15px_5px_rgba(0,0,0,0.3)]`}
                      style={{ height: "560px", width: "100%" }}
                    >
                      <div
                        className={`bg-color-stepper-card-${theme} text-lg p-4 rounded-md mb-4 text-center shadow-[5px_5px_15px_5px_rgba(0,0,0,0.3)] uppercase`}
                      >
                        <h3>{item?.title}</h3>
                      </div>
                      {props?.dataOfAccountSetups?.[0]?.data?.fundData
                        ?.fund_data?.fund_setting?.account?.applicant?.identity
                        ?.indivisual?.provider?.verify?.face?.isBlured && (
                        <h5
                          className={`text-center mb-3 mt-3 text-color-text-${theme}`}
                        >
                          For Personal Privacy Purpose The Captured Images Will
                          Be Blurred.
                        </h5>
                      )}
                      {face ? (
                        <div className="flex justify-center">
                          <img
                            style={{
                              height: "420px",
                              maxWidth: "410px",
                              filter: props?.dataOfAccountSetups?.[0]?.data
                                ?.fundData?.fund_data?.fund_setting?.account
                                ?.applicant?.identity?.indivisual?.provider
                                ?.verify?.face?.isBlured
                                ? "blur(8px)"
                                : "",
                            }}
                            src={index === 0 ? identification : face}
                            alt="capturedImage"
                          />
                        </div>
                      ) : (!proceed || faceKey !== item?.key) &&
                        !imageCapturedData[item?.key] ? (
                        <div className="flex flex-col items-center"
                        style={{ height: "400px"}}>
                          {item?.isIdCard ? (
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
                          ) : (
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
                          )}
                          {item?.instructions.indexOf("</") !== -1 ? (
                            <div
                              style={{ fontSize: "20px", textAlign: "center" }}
                              className={`text-color-text-${theme}`}
                              dangerouslySetInnerHTML={{
                                __html: item?.instructions.replace(
                                  /(<? *script)/gi,
                                  "illegalscript"
                                ),
                              }}
                            ></div>
                          ) : (
                            <div
                              style={{ fontSize: "19px", textAlign: "center" }}
                            >
                              {item?.instructions
                                ?.split(" ")
                                .map(
                                  (word) =>
                                    word.charAt(0).toUpperCase() +
                                    word.slice(1).toLowerCase()
                                )
                                .join(" ")}
                            </div>
                          )}
                          <button
                            disabled={faceKey !== item?.key}
                            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded mt-4"
                            onClick={() => handleProceedClick(item?.key)}
                          >
                            Proceed
                          </button>
                        </div>
                      ) : (
                        ((proceed && faceKey === item?.key) ||
                          imageCapturedData[item?.key]) && (
                          <div className="flex flex-col items-center">
                            <CameraCapture
                              handleChangeLocation={handleChangeLocation}
                              onImageCapture={handleImageCaptureOne}
                              handleSetFaceImages={props?.handleSetFaceImages}
                              faceImages={props?.faceImages}
                              faceSnapkey={item?.key}
                              index={index}
                              isIdCard={item?.isIdCard}
                              resetData={resetData}
                              cameraCloseBrowser={cameraClose}
                              dataOfAccountSetups={dataOfAccountSetups}
                            />
                          </div>
                        )
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <Button
            text="API Hitt"
            className={`bg-color-stepper-proceedbutton-${theme} hover:bg-red-600 text-white py-4 lg:py-[20px] px-4 rounded-lg mx-auto block mt-10`}
            onClick={submitFaceVerfication}
          />
        </>
      )}
    </>
  );
}

export default FaceVerification;
